import "server-only";
import type { ReportResult } from "@/lib/domain/report";
import { createServiceRoleClient } from "@/lib/data/supabase-server";
import { parseAdviceId } from "@/lib/validation/advice-id";

/**
 * Record a public report. Does not change advice status (U6).
 * Only approved items are reportable (pending/rejected/flagged are not public).
 */
export async function insertAdviceReport(adviceId: unknown): Promise<ReportResult> {
  const parsed = parseAdviceId(adviceId);
  if (!parsed.ok) {
    return { kind: "unavailable" };
  }
  const client = createServiceRoleClient();
  if (!client) {
    return { kind: "unavailable" };
  }
  const { data, error: lookupError } = await client
    .from("advice")
    .select("id")
    .eq("id", parsed.id)
    .eq("status", "approved")
    .maybeSingle();
  if (lookupError) {
    console.error("Advice report lookup failed");
    return { kind: "unavailable" };
  }
  if (!data || typeof data.id !== "string") {
    return { kind: "unavailable" };
  }
  const { error: insertError } = await client.from("advice_report").insert({
    advice_id: data.id,
  });
  if (insertError) {
    console.error("Advice report insert failed");
    return { kind: "unavailable" };
  }
  return { kind: "received" };
}
