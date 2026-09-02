import "server-only";
import { parseRequestedAge } from "@/lib/validation/age";
import type { PublicAdvicePick } from "@/lib/domain/public-advice";
import { MAX_ADVICE_EXCLUSION_IDS, type AdviceExclusion } from "@/lib/session/exclusion";
import { createServiceRoleClient } from "@/lib/data/supabase-server";

function toUuidList(ids: readonly string[]): string[] {
  const uuids = ids.filter((id) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id),
  );
  return uuids.slice(0, MAX_ADVICE_EXCLUSION_IDS);
}

/**
 * Server-only uniform random pick among approved, in-range advice.
 * Does not recycle when the remainder is empty.
 */
export async function pickPublicAdvice(
  requestedAge: unknown,
  exclusion: AdviceExclusion = { seenIds: [] },
): Promise<PublicAdvicePick> {
  const parsed = parseRequestedAge(requestedAge);
  if (!parsed.ok) {
    return { kind: "invalid-age" };
  }
  const client = createServiceRoleClient();
  if (!client) {
    return { kind: "unavailable" };
  }
  const { data, error } = await client.rpc("pick_public_advice", {
    p_age: parsed.age,
    p_exclude: toUuidList(exclusion.seenIds),
  });
  if (error) {
    console.error("Public advice selection failed");
    return { kind: "unavailable" };
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (row == null) {
    return { kind: "exhausted", age: parsed.age };
  }
  if (typeof row.id !== "string" || typeof row.body !== "string") {
    console.error("Public advice selection returned an unexpected payload");
    return { kind: "unavailable" };
  }
  return {
    kind: "item",
    age: parsed.age,
    item: { id: row.id, body: row.body },
  };
}
