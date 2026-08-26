"use server";

import { insertAdviceReport } from "@/lib/data/advice-report";
import type { ReportResult } from "@/lib/domain/report";
import { coarseClientKey } from "@/lib/security/client-key";
import { consumeRateLimit } from "@/lib/security/rate-limit";

/**
 * Public report intake. Only the advice id is read.
 * Extra keys are ignored. No reason taxonomy (U8).
 */
export async function submitAdviceReport(input: unknown): Promise<ReportResult> {
  const payload =
    input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};
  try {
    const key = await coarseClientKey();
    if (consumeRateLimit("report", key) === "limited") {
      console.error("Advice report rate-limited");
      return { kind: "rate-limited" };
    }
    return await insertAdviceReport(payload.adviceId);
  } catch {
    console.error("Advice report submission failed");
    return { kind: "unavailable" };
  }
}
