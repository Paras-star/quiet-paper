import { describe, expect, it } from "vitest";
import { rememberSeen, seenIdsForAge } from "@/lib/session/exclusion";
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
});
