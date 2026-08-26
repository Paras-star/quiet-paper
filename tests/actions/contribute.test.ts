import { beforeEach, describe, expect, it, vi } from "vitest";
const { insertCommunityAdvice, consumeRateLimit, coarseClientKey } = vi.hoisted(() => ({
  insertCommunityAdvice: vi.fn(),
  consumeRateLimit: vi.fn(),
  coarseClientKey: vi.fn(),
}));
vi.mock("@/lib/data/advice-contribute", () => ({ insertCommunityAdvice }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRateLimit }));
vi.mock("@/lib/security/client-key", () => ({ coarseClientKey }));
import { submitCommunityAdvice } from "@/app/actions/contribute";
describe("submitCommunityAdvice", () => {
  beforeEach(() => {
    insertCommunityAdvice.mockReset();
    consumeRateLimit.mockReset();

    coarseClientKey.mockReset();
    coarseClientKey.mockResolvedValue("test-key");
    consumeRateLimit.mockReturnValue("allow");
    insertCommunityAdvice.mockResolvedValue({ kind: "received" });
  });
  it("passes only min age, max age, and body", async () => {
    await submitCommunityAdvice({
      minAge: 20, maxAge: 30, body: "Keep one evening free.", status: "approved", source: "editorial", email: "nobody@example.com",
    });
    expect(insertCommunityAdvice).toHaveBeenCalledWith(20, 30, "Keep one evening free.");
    expect(insertCommunityAdvice).toHaveBeenCalledTimes(1);
    expect(consumeRateLimit).toHaveBeenCalledWith("contribute", "test-key");

  });
  it("does not let client-supplied keys choose the rate-limit bucket", async () => {
    await submitCommunityAdvice({
      minAge: 20, maxAge: 30, body: "Keep one evening free.", clientKey: "attacker-chosen", rateLimitKey: "bypass",
    });
    expect(consumeRateLimit).toHaveBeenCalledWith("contribute", "test-key");
    expect(consumeRateLimit).not.toHaveBeenCalledWith("contribute", "attacker-chosen");
    expect(consumeRateLimit).not.toHaveBeenCalledWith("contribute", "bypass");
  });
  it("does not insert when rate-limited", async () => {
    consumeRateLimit.mockReturnValue("limited");
    await expect( submitCommunityAdvice({ minAge: 20, maxAge: 30, body: "Keep one evening free." }),

    ).resolves.toEqual({ kind: "rate-limited" });
    expect(insertCommunityAdvice).not.toHaveBeenCalled();
  });
});
