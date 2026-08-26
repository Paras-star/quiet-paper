"use server";

import { pickPublicAdvice } from "@/lib/data/advice-select";
import type { PublicAdvicePick } from "@/lib/domain/public-advice";
import type { AdviceExclusion } from "@/lib/session/exclusion";
import { coarseClientKey } from "@/lib/security/client-key";
import { consumeRateLimit } from "@/lib/security/rate-limit";

/**
 * Public obtain/next advice. Age and eligibility are validated on the server.
 * Browser-supplied seen ids are an exclusion hint only (U7 memory MVP).
 */
export async function requestPublicAdvice(
  requestedAge: unknown,
  seenIds: unknown,
): Promise<PublicAdvicePick> {
  const ids = Array.isArray(seenIds)
    ? seenIds.filter((id): id is string => typeof id === "string")
    : [];
  const exclusion: AdviceExclusion = { seenIds: ids };
  try {
    const key = await coarseClientKey();
    if (consumeRateLimit("select", key) === "limited") {
      console.error("Public advice selection rate-limited");
      return { kind: "rate-limited" };
    }
    return await pickPublicAdvice(requestedAge, exclusion);
  } catch {
    console.error("Public advice selection failed");
    return { kind: "unavailable" };
  }
}
