import { beforeEach, describe, expect, it, vi } from "vitest";

const { pickPublicAdvice, consumeRateLimit, coarseClientKey } = vi.hoisted(() => ({
  pickPublicAdvice: vi.fn(),
  consumeRateLimit: vi.fn(),
  coarseClientKey: vi.fn(),
}));

vi.mock("@/lib/data/advice-select", () => ({ pickPublicAdvice }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRateLimit }));
vi.mock("@/lib/security/client-key", () => ({ coarseClientKey }));

import { requestPublicAdvice } from "@/app/actions/advice";

describe("requestPublicAdvice", () => {
  beforeEach(() => {
    pickPublicAdvice.mockReset();
    consumeRateLimit.mockReset();
    coarseClientKey.mockReset();
    coarseClientKey.mockResolvedValue("test-key");
    consumeRateLimit.mockReturnValue("allow");
    pickPublicAdvice.mockResolvedValue({
      kind: "item",
      age: 25,
      item: { id: "550e8400-e29b-41d4-a716-446655440000", body: "Keep one evening free." },
    });
  });

  it("does not select public advice for ages 71–100", async () => {
    await expect(requestPublicAdvice(71, [])).resolves.toEqual({ kind: "unavailable" });
    await expect(requestPublicAdvice(74, [])).resolves.toEqual({ kind: "unavailable" });
    await expect(requestPublicAdvice(75, [])).resolves.toEqual({ kind: "unavailable" });
    await expect(requestPublicAdvice(100, [])).resolves.toEqual({ kind: "unavailable" });
    expect(pickPublicAdvice).not.toHaveBeenCalled();
    expect(coarseClientKey).not.toHaveBeenCalled();
  });

  it("still selects for ages below 71", async () => {
    await requestPublicAdvice(70, []);
    await requestPublicAdvice(25, []);
    expect(pickPublicAdvice).toHaveBeenCalledTimes(2);
    expect(pickPublicAdvice).toHaveBeenCalledWith(70, { seenIds: [] });
    expect(pickPublicAdvice).toHaveBeenCalledWith(25, { seenIds: [] });
  });

  it("does not select for invalid ages that never reach the RPC", async () => {
    pickPublicAdvice.mockResolvedValue({ kind: "invalid-age" });
    await expect(requestPublicAdvice(101, [])).resolves.toEqual({ kind: "invalid-age" });
    expect(pickPublicAdvice).toHaveBeenCalledWith(101, { seenIds: [] });
  });

  it("forwards a normal exclusion list to selection unchanged", async () => {
    const seen = [
      "550e8400-e29b-41d4-a716-446655440000",
      "11111111-1111-4111-8111-111111111111",
    ];
    await requestPublicAdvice(25, seen);
    expect(pickPublicAdvice).toHaveBeenCalledWith(25, { seenIds: seen });
  });

  it("does not select when the select rate limit is exhausted", async () => {
    consumeRateLimit.mockReturnValue("limited");
    await expect(requestPublicAdvice(25, ["550e8400-e29b-41d4-a716-446655440000"])).resolves.toEqual({
      kind: "rate-limited",
    });
    expect(consumeRateLimit).toHaveBeenCalledWith("select", "test-key");
    expect(pickPublicAdvice).not.toHaveBeenCalled();
  });
});
