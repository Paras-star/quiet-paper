"use server";

import { insertCommunityAdvice } from "@/lib/data/advice-contribute";
import type { ContributionResult } from "@/lib/domain/contribution";
import { coarseClientKey } from "@/lib/security/client-key";
import { consumeRateLimit } from "@/lib/security/rate-limit";

/**
 * Public contribution intake. Only min age, max age, and body are read.
 * Extra keys including status, source, and email are ignored.
 */
export async function submitCommunityAdvice(input: unknown): Promise<ContributionResult> {
  const payload =
    input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};
  try {
    const key = await coarseClientKey();
    if (consumeRateLimit("contribute", key) === "limited") {
      console.error("Community advice rate-limited");
      return { kind: "rate-limited" };
    }
    return await insertCommunityAdvice(payload.minAge, payload.maxAge, payload.body);
  } catch {
    console.error("Community advice submission failed");
    return { kind: "unavailable" };
  }
}
