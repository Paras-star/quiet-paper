import { describe, expect, it } from "vitest";
import { parseContributionAgeRange, parseRequestedAge } from "@/lib/validation/age";
describe("parseRequestedAge", () => {
  it("accepts integers 10–100", () => {
    expect(parseRequestedAge(10)).toEqual({ ok: true, age: 10 });
    expect(parseRequestedAge("100")).toEqual({ ok: true, age: 100 });
    expect(parseRequestedAge(" 42 ")).toEqual({ ok: true, age: 42 });
  });

  it("rejects empty, non-integers, and out of range", () => {
    expect(parseRequestedAge("")).toEqual({ ok: false, issue: "empty" });
    expect(parseRequestedAge(null)).toEqual({ ok: false, issue: "empty" });
    expect(parseRequestedAge("12.5")).toEqual({ ok: false, issue: "integer" });
    expect(parseRequestedAge("-1")).toEqual({ ok: false, issue: "integer" });
    expect(parseRequestedAge(9)).toEqual({ ok: false, issue: "range" });
    expect(parseRequestedAge(101)).toEqual({ ok: false, issue: "range" });
  });
});
describe("parseContributionAgeRange", () => {
  it("requires min ≤ max within 10–100", () => {
    expect(parseContributionAgeRange("18", "30")).toEqual({
      ok: true, minimumAge: 18, maximumAge: 30,
    });
    expect(parseContributionAgeRange(40, 20)).toMatchObject({ ok: false, order: true });

    expect(parseContributionAgeRange("", "20")).toMatchObject({
      ok: false, minimumIssue: "empty",
    });
  });
});
