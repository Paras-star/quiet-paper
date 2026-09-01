import type { PublicAdvicePick } from "@/lib/domain/public-advice";
import {
  rememberSeen,
  seenIdsForAge,
  shouldRecycleExhaustion,
  startAdviceSession,
  type SeenByAge,
} from "@/lib/session/exclusion";

export type AdviceRequestMode = "first" | "next";

type PickFn = (age: number, seenIds: readonly string[]) => Promise<PublicAdvicePick>;

/**
 * One obtain/next step. The RPC still returns exhausted when the remainder is
 * empty; this layer resets the session exclusion and retries once so a
 * non-empty pool can recycle. An empty first remainder stays exhausted.
 */
export async function pickInAdviceSession(
  age: number,
  mode: AdviceRequestMode,
  seen: SeenByAge,
  pick: PickFn,
): Promise<{ result: PublicAdvicePick; seen: SeenByAge }> {
  let nextSeen = mode === "first" ? startAdviceSession(seen, age) : seen;
  let result = await pick(age, seenIdsForAge(nextSeen, age));
  if (result.kind === "exhausted" && shouldRecycleExhaustion(seenIdsForAge(nextSeen, age))) {
    nextSeen = startAdviceSession(nextSeen, age);
    result = await pick(age, seenIdsForAge(nextSeen, age));
  }
  if (result.kind === "item") {
    nextSeen = rememberSeen(nextSeen, result.age, result.item.id);
  }
  return { result, seen: nextSeen };
}