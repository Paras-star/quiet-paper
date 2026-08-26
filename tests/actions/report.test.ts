import { beforeEach, describe, expect, it, vi } from "vitest";
const { insertAdviceReport, consumeRateLimit, coarseClientKey } = vi.hoisted(() => ({
  insertAdviceReport: vi.fn(),
  consumeRateLimit: vi.fn(),
  coarseClientKey: vi.fn(),
}));
vi.mock("@/lib/data/advice-report", () => ({ insertAdviceReport }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRateLimit }));
vi.mock("@/lib/security/client-key", () => ({ coarseClientKey }));
import { submitAdviceReport } from "@/app/actions/report";

const ITEM_ID = "550e8400-e29b-41d4-a716-446655440000";
describe("submitAdviceReport", () => {
  beforeEach(() => {
    insertAdviceReport.mockReset();
    consumeRateLimit.mockReset();
    coarseClientKey.mockReset();
    coarseClientKey.mockResolvedValue("test-key");
    consumeRateLimit.mockReturnValue("allow");
    insertAdviceReport.mockResolvedValue({ kind: "received" });
  });
  it("forwards only the advice id and ignores extra fields", async () => {
    await submitAdviceReport({
      adviceId: ITEM_ID, reason: "spam", email: "nobody@example.com", status: "flagged",
    });

    expect(insertAdviceReport).toHaveBeenCalledWith(ITEM_ID);
  });
  it("does not write when rate-limited", async () => {
    consumeRateLimit.mockReturnValue("limited");
    await expect(submitAdviceReport({ adviceId: ITEM_ID })).resolves.toEqual({
      kind: "rate-limited",
    });
    expect(insertAdviceReport).not.toHaveBeenCalled();
  });
});
