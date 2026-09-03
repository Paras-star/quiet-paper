import { describe, expect, it } from "vitest";
import { contributionPrefillForWisdom, shouldEnterWisdomSharing } from "@/lib/session/wisdom";

describe("wisdom sharing session helpers", () => {
  it("routes 75–100 to wisdom and leaves 10–74 on the advice loop", () => {
    expect(shouldEnterWisdomSharing(70)).toBe(false);
    expect(shouldEnterWisdomSharing(71)).toBe(false);
    expect(shouldEnterWisdomSharing(74)).toBe(false);
    expect(shouldEnterWisdomSharing(75)).toBe(true);
    expect(shouldEnterWisdomSharing(82)).toBe(true);
    expect(shouldEnterWisdomSharing(90)).toBe(true);
    expect(shouldEnterWisdomSharing(99)).toBe(true);
    expect(shouldEnterWisdomSharing(100)).toBe(true);
    expect(shouldEnterWisdomSharing(101)).toBe(false);
    expect(shouldEnterWisdomSharing(25)).toBe(false);
  });

  it("treats 75, 82, 90, 99, and 100 as the same wisdom path", () => {
    for (const age of [75, 82, 90, 99, 100]) {
      expect(shouldEnterWisdomSharing(age)).toBe(true);
      expect(contributionPrefillForWisdom(true, String(age))).toBe("");
    }
  });

  it("changing 25 to 82 leaves the advice loop and enters wisdom", () => {
    expect(shouldEnterWisdomSharing(25)).toBe(false);
    expect(shouldEnterWisdomSharing(82)).toBe(true);
  });

  it("changing 82 to 25 leaves wisdom and returns to the advice loop", () => {
    expect(shouldEnterWisdomSharing(82)).toBe(true);
    expect(shouldEnterWisdomSharing(25)).toBe(false);
  });

  it("leaves contribution age fields empty on the wisdom path", () => {
    expect(contributionPrefillForWisdom(true, "82")).toBe("");
    expect(contributionPrefillForWisdom(true, "75")).toBe("");
    expect(contributionPrefillForWisdom(false, "25")).toBe("25");
    expect(contributionPrefillForWisdom(false, "74")).toBe("74");
  });
});
