import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const experience = readFileSync("components/advice-experience.tsx", "utf8");
const invite = readFileSync("components/wisdom-invite.tsx", "utf8");

describe("wisdom experience wiring", () => {
  it("starts on the age landing so refresh returns to landing", () => {
    expect(experience).toContain('useState<Screen>({ name: "age" })');
  });

  it("enters wisdom before any normal advice-selection request", () => {
    const handle = experience.slice(experience.indexOf("function handleValidAge"));
    const wisdomCheck = handle.indexOf("isWisdomSharingAge(age)");
    const wisdomScreen = handle.indexOf('setScreen({ name: "wisdom", age })');
    const requestFirst = handle.indexOf('void requestAdvice(age, "first")');
    expect(wisdomCheck).toBeGreaterThan(-1);
    expect(wisdomScreen).toBeGreaterThan(wisdomCheck);
    expect(requestFirst).toBeGreaterThan(wisdomScreen);
  });

  it("opens the existing Offer Advice form from wisdom with empty age prefill", () => {
    expect(experience).toContain("onOfferAdvice={() => openContribute(false)}");
    expect(experience).toContain("contributionPrefillForWisdom(true, sessionAge)");
    expect(experience).toContain("initialMinAge={screen.prefill}");
    expect(experience).toContain("initialMaxAge={screen.prefill}");
  });

  it("returns to the wisdom screen on Back and post-submit Back", () => {
    expect(experience).toContain(
      'backLabel={resumeWisdom || !canReturnToAdvice ? "Back" : "Back to advice"}',
    );
    expect(experience).toContain("onBack={() => restoreLoop(screen.resume)}");
    expect(experience).toContain(
      'primaryLabel={resumeWisdom ? "Back" : restoreAdvice ? "Back to advice" : "See advice"}',
    );
    expect(experience).toContain(
      "resumeWisdom || restoreAdvice ? restoreLoop(screen.resume) : goToAge()",
    );
  });
});

describe("wisdom invite", () => {
  it("keeps Offer advice and Change age, with no next, report, or advice body", () => {
    expect(invite).toContain("Offer advice");
    expect(invite).toContain("Change age");
    expect(invite).toContain("You’ve lived through experiences younger people haven’t.");
    expect(invite).toContain(
      "Share something you’ve learned that might help them. We’ll review it before it can appear.",
    );
    expect(invite).not.toMatch(/Another piece|Next/);
    expect(invite).not.toMatch(/Report/i);
    expect(invite).not.toMatch(/That’s all we have/);
  });
});
