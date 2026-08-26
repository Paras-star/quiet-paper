import { beforeEach, describe, expect, it, vi } from "vitest";
const { maybeSingle, reportInsert, adviceUpdate, createServiceRoleClient, eqCalls } = vi.hoisted( () => ({
    maybeSingle: vi.fn(),
    reportInsert: vi.fn(),
    adviceUpdate: vi.fn(),

    createServiceRoleClient: vi.fn(),
    eqCalls: [] as Array<[string, unknown]>,
  }),
);
vi.mock("@/lib/data/supabase-server", () => ({
  createServiceRoleClient: () => createServiceRoleClient(),
}));
import { insertAdviceReport } from "@/lib/data/advice-report";
const ITEM_ID = "550e8400-e29b-41d4-a716-446655440000";
function approvedLookupClient() {
  eqCalls.length = 0;
  const chain = {
    select: () => chain, eq: (column: string, value: unknown) => {
      eqCalls.push([column, value]);

      return chain;
    },
    maybeSingle, insert: reportInsert, update: adviceUpdate,
  };
  return {
    from: (table: string) => {
      if (table === "advice_report") {
        return { insert: reportInsert, update: adviceUpdate };
      }
      return chain;
    },
  };
}
describe("insertAdviceReport", () => {
  beforeEach(() => {
    maybeSingle.mockReset();

    reportInsert.mockReset();
    adviceUpdate.mockReset();
    createServiceRoleClient.mockReset();
  });
  it("rejects invalid ids without querying", async () => {
    await expect(insertAdviceReport("not-a-uuid")).resolves.toEqual({ kind: "unavailable" });
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });
  it("does not insert when the item is not an approved public row", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    createServiceRoleClient.mockReturnValue(approvedLookupClient());
    await expect(insertAdviceReport(ITEM_ID)).resolves.toEqual({ kind: "unavailable" });
    expect(eqCalls).toContainEqual(["status", "approved"]);
    expect(reportInsert).not.toHaveBeenCalled();
  });
  it("inserts a report without updating advice status", async () => {

    maybeSingle.mockResolvedValue({ data: { id: ITEM_ID }, error: null });
    reportInsert.mockResolvedValue({ error: null });
    createServiceRoleClient.mockReturnValue(approvedLookupClient());
    await expect(insertAdviceReport(ITEM_ID)).resolves.toEqual({ kind: "received" });
    expect(reportInsert).toHaveBeenCalledWith({ advice_id: ITEM_ID });
    expect(reportInsert.mock.calls[0]?.[0]).not.toHaveProperty("status");
    expect(adviceUpdate).not.toHaveBeenCalled();
  });
  it("returns a generic unavailable result on lookup or insert failure", async () => {
    createServiceRoleClient.mockReturnValue(approvedLookupClient());
    maybeSingle.mockResolvedValue({ data: null, error: { message: "db" } });
    await expect(insertAdviceReport(ITEM_ID)).resolves.toEqual({ kind: "unavailable" });
    expect(reportInsert).not.toHaveBeenCalled();
    maybeSingle.mockResolvedValue({ data: { id: ITEM_ID }, error: null });
    reportInsert.mockResolvedValue({ error: { message: "db" } });
    await expect(insertAdviceReport(ITEM_ID)).resolves.toEqual({ kind: "unavailable" });

  });
});
