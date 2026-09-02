import { beforeEach, describe, expect, it, vi } from "vitest";
const { rpc, createServiceRoleClient } = vi.hoisted(() => ({
  rpc: vi.fn(),
  createServiceRoleClient: vi.fn(),
}));
vi.mock("@/lib/data/supabase-server", () => ({
  createServiceRoleClient: () => createServiceRoleClient(),
}));
import { pickPublicAdvice } from "@/lib/data/advice-select";
import { MAX_ADVICE_EXCLUSION_IDS } from "@/lib/session/exclusion";
const ITEM_ID = "550e8400-e29b-41d4-a716-446655440000";
const OTHER_ID = "11111111-1111-4111-8111-111111111111";
const THIRD_ID = "22222222-2222-4222-8222-222222222222";

describe("pickPublicAdvice", () => {
  beforeEach(() => {
    rpc.mockReset();
    createServiceRoleClient.mockReset();
  });
  it("rejects invalid ages without querying", async () => {
    const result = await pickPublicAdvice(9);
    expect(result).toEqual({ kind: "invalid-age" });
    expect(createServiceRoleClient).not.toHaveBeenCalled();
    await expect(pickPublicAdvice(101)).resolves.toEqual({ kind: "invalid-age" });
  });
  it("queries for a valid in-range age", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({
      data: [{ id: ITEM_ID, body: "Keep one evening free." }],
      error: null,
    });

    await expect(pickPublicAdvice(10)).resolves.toMatchObject({ kind: "item", age: 10 });
    expect(rpc).toHaveBeenCalledWith("pick_public_advice", {
      p_age: 10, p_exclude: [],
    });
  });
  it("returns unavailable when the server client is missing", async () => {
    createServiceRoleClient.mockReturnValue(null);
    await expect(pickPublicAdvice(25)).resolves.toEqual({ kind: "unavailable" });
  });
  it("returns exhausted when the remainder is empty (no recycle)", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({ data: [], error: null });
    await expect(pickPublicAdvice(25, { seenIds: [ITEM_ID] })).resolves.toEqual({
      kind: "exhausted", age: 25,
    });

  });
  it("returns unavailable for rpc errors and malformed rows", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({ data: null, error: { message: "db" } });
    await expect(pickPublicAdvice(25)).resolves.toEqual({ kind: "unavailable" });
    rpc.mockResolvedValue({ data: [{ id: ITEM_ID }], error: null });
    await expect(pickPublicAdvice(25)).resolves.toEqual({ kind: "unavailable" });
  });
  it("returns an item and passes only uuid exclusions to the rpc", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({
      data: [{ id: OTHER_ID, body: "Keep one evening free." }],
      error: null,
    });
    const result = await pickPublicAdvice(30, { seenIds: [ITEM_ID, "not-a-uuid"] });

    expect(result).toEqual({
      kind: "item", age: 30, item: { id: OTHER_ID, body: "Keep one evening free." },
    });
    expect(rpc).toHaveBeenCalledWith("pick_public_advice", {
      p_age: 30, p_exclude: [ITEM_ID],
    });
  });
  it("keeps a normal uuid exclusion list unchanged for the rpc", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({
      data: [{ id: THIRD_ID, body: "Keep one evening free." }],
      error: null,
    });
    await pickPublicAdvice(25, { seenIds: [ITEM_ID, OTHER_ID] });
    expect(rpc).toHaveBeenCalledWith("pick_public_advice", {
      p_age: 25, p_exclude: [ITEM_ID, OTHER_ID],
    });
  });
  it("does not pass more exclusion uuids to the rpc than the server maximum", async () => {
    createServiceRoleClient.mockReturnValue({ rpc });
    rpc.mockResolvedValue({ data: [], error: null });
    const extras = Array.from({ length: MAX_ADVICE_EXCLUSION_IDS }, (_, index) =>
      `33333333-3333-4333-8333-${String(index).padStart(12, "0")}`,
    );
    await pickPublicAdvice(25, {
      seenIds: [ITEM_ID, "not-a-uuid", ...extras, OTHER_ID],
    });
    const sent = rpc.mock.calls[0]?.[1]?.p_exclude as string[];
    expect(sent).toHaveLength(MAX_ADVICE_EXCLUSION_IDS);
    expect(sent[0]).toBe(ITEM_ID);
    expect(sent).not.toContain("not-a-uuid");
    expect(sent).not.toContain(OTHER_ID);
  });
});
