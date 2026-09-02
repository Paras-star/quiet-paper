import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

type AdviceRow = {
  id: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  published_at: string | null;
  minimum_age: number;
  maximum_age: number;
};

/** Mirrors supabase/migrations/0003_pick_public_advice_published.sql WHERE clause. */
function isPubliclySelectable(row: AdviceRow, age: number, exclude: string[] = []): boolean {
  return (
    row.status === "approved" &&
    row.published_at !== null &&
    row.minimum_age <= age &&
    row.maximum_age >= age &&
    !exclude.includes(row.id)
  );
}

describe("SQL eligibility (no live database)", () => {
  it("selects only approved published in-range rows and does not recycle", () => {
    const sql = readFileSync("supabase/migrations/0003_pick_public_advice_published.sql", "utf8");
    expect(sql).toContain("CREATE OR REPLACE FUNCTION public.pick_public_advice(");
    expect(sql).toContain("RETURNS TABLE (id uuid, body text)");
    expect(sql).toContain("a.status = 'approved'");
    expect(sql).toContain("a.published_at IS NOT NULL");
    expect(sql).toContain("a.minimum_age <= p_age");
    expect(sql).toContain("a.maximum_age >= p_age");
    expect(sql).toContain("LIMIT 1");
    expect(sql).toContain("ORDER BY random()");
    expect(sql).not.toMatch(/status\s*=\s*'pending'/);
  });

  it("treats approved+published as eligible and withholds other lifecycle combinations", () => {
    const published = "2026-08-31T17:43:05.523Z";
    const inRange = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      minimum_age: 19,
      maximum_age: 22,
    };

    expect(
      isPubliclySelectable({ ...inRange, status: "approved", published_at: published }, 21),
    ).toBe(true);
    expect(
      isPubliclySelectable({ ...inRange, status: "approved", published_at: null }, 21),
    ).toBe(false);
    expect(
      isPubliclySelectable({ ...inRange, status: "pending", published_at: published }, 21),
    ).toBe(false);
    expect(
      isPubliclySelectable({ ...inRange, status: "rejected", published_at: published }, 21),
    ).toBe(false);
    expect(
      isPubliclySelectable({ ...inRange, status: "flagged", published_at: published }, 21),
    ).toBe(false);
    expect(
      isPubliclySelectable({ ...inRange, status: "approved", published_at: published }, 18),
    ).toBe(false);
    expect(
      isPubliclySelectable({ ...inRange, status: "approved", published_at: published }, 23),
    ).toBe(false);
    expect(
      isPubliclySelectable(
        { ...inRange, status: "approved", published_at: published },
        21,
        [inRange.id],
      ),
    ).toBe(false);
  });
  it("denies anonymous table access by default", () => {
    const advice = readFileSync("supabase/migrations/0001_advice.sql", "utf8");
    const reports = readFileSync("supabase/migrations/0002_reports.sql", "utf8");
    expect(advice).toContain("ENABLE ROW LEVEL SECURITY");
    expect(advice).toContain("FORCE ROW LEVEL SECURITY");
    expect(advice).toContain("REVOKE ALL ON TABLE public.advice FROM PUBLIC, anon, authenticated");
    expect(reports).toContain(
      "REVOKE ALL ON TABLE public.advice_report FROM PUBLIC, anon, authenticated",
    );
    expect(advice).not.toContain("CREATE POLICY");
    expect(reports).not.toContain("CREATE POLICY");
  });
});
