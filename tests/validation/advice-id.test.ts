import { describe, expect, it } from "vitest";
import { parseAdviceId } from "@/lib/validation/advice-id";
const SAMPLE = "550e8400-e29b-41d4-a716-446655440000";
describe("parseAdviceId", () => {
  it("accepts UUID strings", () => {
    expect(parseAdviceId(SAMPLE)).toEqual({ ok: true, id: SAMPLE });
    expect(parseAdviceId(` ${SAMPLE.toUpperCase()} `).ok).toBe(true);

  });
  it("rejects missing or malformed ids", () => {
    expect(parseAdviceId("")).toEqual({ ok: false });
    expect(parseAdviceId("not-a-uuid")).toEqual({ ok: false });
    expect(parseAdviceId(1)).toEqual({ ok: false });
  });
});
