import { describe, expect, it } from "vitest";
import { ADVICE_BODY_MAX_CHARS, parseAdviceBody } from "@/lib/validation/advice-body";
describe("parseAdviceBody", () => {
  it("trims and accepts non-empty text within the engineering ceiling", () => {
    expect(parseAdviceBody("  Keep one evening free.  ")).toEqual({
      ok: true, body: "Keep one evening free.",
    });
    expect(parseAdviceBody("a".repeat(ADVICE_BODY_MAX_CHARS)).ok).toBe(true);
  });
  it("rejects blank, non-string, and over-long bodies", () => {

    expect(parseAdviceBody("   ")).toEqual({ ok: false, issue: "empty" });
    expect(parseAdviceBody(null)).toEqual({ ok: false, issue: "empty" });
    expect(parseAdviceBody("a".repeat(ADVICE_BODY_MAX_CHARS + 1))).toEqual({
      ok: false, issue: "too-long",
    });
  });
});
