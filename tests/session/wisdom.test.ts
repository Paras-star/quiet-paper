import { describe, expect, it } from "vitest";
import { contributionPrefillForWisdom, shouldEnterWisdomSharing } from "@/lib/session/wisdom";

describe("wisdom sharing session helpers", () => {
  it("routes 71–100 to wisdom and leaves 10–70 on the advice loop", () => {
    expect(shouldEnterWisdomSharing(70)).toBe(false);
    expect(shouldEnterWisdomSharing(71)).toBe(true);
    expect(shouldEnterWisdomSharing(74)).toBe(true);
    expect(shouldEnterWisdomSharing(75)).toBe(true);
    expect(shouldEnterWisdomSharing(100)).toBe(true);
    expect(shouldEnterWisdomSharing(25)).toBe(false);
  });

  it("leaves contribution age fields empty on the wisdom path", () => {
    expect(contributionPrefillForWisdom(true, "82")).toBe("");
    expect(contributionPrefillForWisdom(false, "25")).toBe("25");
    expect(contributionPrefillForWisdom(false, "82")).toBe("82");
  });
});
