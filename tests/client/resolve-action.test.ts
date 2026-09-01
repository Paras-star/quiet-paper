import { describe, expect, it } from "vitest";
import { resolveAction } from "@/lib/client/resolve-action";

describe("resolveAction", () => {
  it("returns the action result when the call succeeds", async () => {
    await expect(
      resolveAction(async (): Promise<{ kind: "item" | "unavailable" }> => ({ kind: "item" }), {
        kind: "unavailable",
      }),
    ).resolves.toEqual({
      kind: "item",
    });
  });

  it("returns the fallback when the action rejects so loading can clear", async () => {
    await expect(
      resolveAction(async () => {
        throw new Error("Invalid Server Actions request.");
      }, { kind: "unavailable" as const }),
    ).resolves.toEqual({ kind: "unavailable" });
  });
});
