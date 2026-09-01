import { describe, expect, it } from "vitest";
import type { PublicAdvicePick } from "@/lib/domain/public-advice";
import { pickInAdviceSession } from "@/lib/session/advice-cycle";
import { seenIdsForAge, type SeenByAge } from "@/lib/session/exclusion";

const AGE = 23;
const OTHER_AGE = 25;

function item(id: string): PublicAdvicePick {
  return { kind: "item", age: AGE, item: { id, body: id } };
}

function exhausted(age = AGE): PublicAdvicePick {
  return { kind: "exhausted", age };
}

/** Deterministic stand-in for pick_public_advice remainder. */
function pickFromPool(pool: readonly string[]) {
  return async (age: number, seenIds: readonly string[]): Promise<PublicAdvicePick> => {
    const next = pool.find((id) => !seenIds.includes(id));
    if (next === undefined) {
      return exhausted(age);
    }
    return { kind: "item", age, item: { id: next, body: next } };
  };
}

describe("pickInAdviceSession", () => {
  it("does not repeat an id before the eligible pool is exhausted", async () => {
    const pool = ["a", "b", "c"];
    const pick = pickFromPool(pool);
    const seenIds: string[] = [];
    let seen: SeenByAge = {};

    for (let i = 0; i < pool.length; i += 1) {
      const step = await pickInAdviceSession(AGE, i === 0 ? "first" : "next", seen, pick);
      expect(step.result.kind).toBe("item");
      if (step.result.kind !== "item") {
        return;
      }
      expect(seenIds).not.toContain(step.result.item.id);
      seenIds.push(step.result.item.id);
      seen = step.seen;
    }
    expect(seenIds).toEqual(pool);
    expect(seenIdsForAge(seen, AGE)).toEqual(pool);
  });

  it("resets exclusion and picks again after the pool is exhausted", async () => {
    const pool = ["a", "b"];
    const pick = pickFromPool(pool);
    let seen: SeenByAge = {};
    const first = await pickInAdviceSession(AGE, "first", seen, pick);
    seen = first.seen;
    const second = await pickInAdviceSession(AGE, "next", seen, pick);
    seen = second.seen;
    expect(first.result).toEqual(item("a"));
    expect(second.result).toEqual(item("b"));
    expect(seenIdsForAge(seen, AGE)).toEqual(["a", "b"]);

    const recycled = await pickInAdviceSession(AGE, "next", seen, pick);
    expect(recycled.result).toEqual(item("a"));
    expect(seenIdsForAge(recycled.seen, AGE)).toEqual(["a"]);
  });

  it("starts a fresh exclusion list when age changes or See advice runs again", async () => {
    const pick = pickFromPool(["a", "b"]);
    let seen: SeenByAge = {};
    seen = (await pickInAdviceSession(AGE, "first", seen, pick)).seen;
    seen = (await pickInAdviceSession(AGE, "next", seen, pick)).seen;
    expect(seenIdsForAge(seen, AGE)).toEqual(["a", "b"]);

    const otherAge = await pickInAdviceSession(OTHER_AGE, "first", seen, async (age, ids) => {
      expect(ids).toEqual([]);
      return { kind: "item", age, item: { id: "x", body: "x" } };
    });
    expect(seenIdsForAge(otherAge.seen, AGE)).toEqual(["a", "b"]);
    expect(seenIdsForAge(otherAge.seen, OTHER_AGE)).toEqual(["x"]);

    const sameAgeAgain = await pickInAdviceSession(AGE, "first", otherAge.seen, pick);
    expect(sameAgeAgain.result).toEqual(item("a"));
    expect(seenIdsForAge(sameAgeAgain.seen, AGE)).toEqual(["a"]);
    expect(seenIdsForAge(sameAgeAgain.seen, OTHER_AGE)).toEqual(["x"]);
  });

  it("keeps a genuinely empty pool exhausted and does not recycle", async () => {
    const calls: string[][] = [];
    const pick = async (age: number, seenIds: readonly string[]): Promise<PublicAdvicePick> => {
      calls.push(seenIds as string[]);
      return exhausted(age);
    };
    const result = await pickInAdviceSession(100, "first", {}, pick);
    expect(result.result).toEqual(exhausted(100));
    expect(seenIdsForAge(result.seen, 100)).toEqual([]);
    expect(calls).toEqual([[]]);

    const nextWhileEmpty = await pickInAdviceSession(100, "next", {}, pick);
    expect(nextWhileEmpty.result).toEqual(exhausted(100));
    expect(calls).toHaveLength(2);
  });

  it("retries recycle only once when the second pick is also empty", async () => {
    const calls: string[][] = [];
    const pick = async (age: number, seenIds: readonly string[]): Promise<PublicAdvicePick> => {
      calls.push([...seenIds]);
      return exhausted(age);
    };
    const result = await pickInAdviceSession(AGE, "next", { [AGE]: ["a"] }, pick);
    expect(result.result).toEqual(exhausted(AGE));
    expect(calls).toEqual([["a"], []]);
    expect(seenIdsForAge(result.seen, AGE)).toEqual([]);
  });
});
