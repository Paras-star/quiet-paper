import { beforeEach, describe, expect, it, vi } from "vitest";
const { headers } = vi.hoisted(() => ({
  headers: vi.fn(),
}));
vi.mock("next/headers", () => ({ headers }));
import { coarseClientKey } from "@/lib/security/client-key";
describe("coarseClientKey", () => {
  beforeEach(() => {
    headers.mockReset();

  });
  it("uses the first forwarded hop, not a later hop", async () => {
    headers.mockResolvedValue({
      get: (name: string) => (name === "x-forwarded-for" ? "203.0.113.10, 198.51.100.2" : null),
    });
    await expect(coarseClientKey()).resolves.toBe("ip:203.0.113.10");
  });
  it("does not read a client-supplied identity header", async () => {
    headers.mockResolvedValue({
      get: (name: string) => {
        if (name === "x-client-key") return "attacker-chosen";
        if (name === "x-forwarded-for") return null;
        if (name === "x-real-ip") return null;
        return "should-not-be-used";
      },
    });
    await expect(coarseClientKey()).resolves.toBe("unknown");

  });
});
