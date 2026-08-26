import { beforeEach, describe, expect, it, vi } from "vitest";
const { insert, createServiceRoleClient } = vi.hoisted(() => ({
  insert: vi.fn(),
  createServiceRoleClient: vi.fn(),
}));

vi.mock("@/lib/data/supabase-server", () => ({
  createServiceRoleClient: () => createServiceRoleClient(),
}));
import { insertCommunityAdvice } from "@/lib/data/advice-contribute";
describe("insertCommunityAdvice", () => {
  beforeEach(() => {
    insert.mockReset();
    createServiceRoleClient.mockReset();
  });
  it("rejects invalid range or body before insert", async () => {
    await expect(insertCommunityAdvice(40, 20, "A useful sentence.")).resolves.toMatchObject({
      kind: "invalid", fields: { order: true },
    });
    await expect(insertCommunityAdvice(20, 30, "   ")).resolves.toMatchObject({
      kind: "invalid",

      fields: { body: "empty" },
    });
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });
  it("inserts pending community rows only", async () => {
    insert.mockResolvedValue({ error: null });
    createServiceRoleClient.mockReturnValue({
      from: () => ({ insert }),
    });
    await expect( insertCommunityAdvice(18, 30, "You can have a next sensible step."),
    ).resolves.toEqual({ kind: "received" });
    expect(insert).toHaveBeenCalledWith({
      body: "You can have a next sensible step.", minimum_age: 18, maximum_age: 30,

      source_type: "community", status: "pending",
    });
  });
  it("returns unavailable on insert failure", async () => {
    insert.mockResolvedValue({ error: { message: "db" } });
    createServiceRoleClient.mockReturnValue({
      from: () => ({ insert }),
    });
    await expect( insertCommunityAdvice(18, 30, "You can have a next sensible step."),
    ).resolves.toEqual({ kind: "unavailable" });
  });
});
