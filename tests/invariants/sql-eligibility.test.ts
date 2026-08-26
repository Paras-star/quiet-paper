import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";
describe("SQL eligibility (no live database)", () => {
  it("selects only approved in-range rows and does not recycle", () => {
    const sql = readFileSync("supabase/migrations/0001_advice.sql", "utf8");
    expect(sql).toContain("a.status = 'approved'");
    expect(sql).toContain("a.minimum_age <= p_age");
    expect(sql).toContain("a.maximum_age >= p_age");
    expect(sql).toContain("LIMIT 1");
    expect(sql).not.toMatch(/status\s*=\s*'pending'/);
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
