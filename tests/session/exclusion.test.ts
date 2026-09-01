import { describe, expect, it } from "vitest";
import {
  clearSeenForAge,
  rememberSeen,
  seenIdsForAge,
  shouldRecycleExhaustion,
  startAdviceSession,
} from "@/lib/session/exclusion";
describe("session exclusion", () => {
  it("keeps seen ids per age and does not duplicate", () => {
    const first = rememberSeen({}, 25, "a");
    const second = rememberSeen(first, 25, "b");
    const again = rememberSeen(second, 25, "a");
    const otherAge = rememberSeen(second, 40, "a");
    expect(seenIdsForAge(second, 25)).toEqual(["a", "b"]);
    expect(again).toBe(second);
    expect(seenIdsForAge(otherAge, 40)).toEqual(["a"]);
    expect(seenIdsForAge(otherAge, 25)).toEqual(["a", "b"]);

  });

  it("clears one age for a new session without dropping other ages", () => {
    const seen = rememberSeen(rememberSeen({}, 25, "a"), 40, "b");
    expect(startAdviceSession(seen, 25)).toEqual({ 40: ["b"] });
    expect(clearSeenForAge(seen, 25)).toEqual({ 40: ["b"] });
    expect(shouldRecycleExhaustion(["a"])).toBe(true);
    expect(shouldRecycleExhaustion([])).toBe(false);
  });
});
