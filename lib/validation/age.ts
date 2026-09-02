const MIN_AGE = 10;
const MAX_AGE = 100;
const WISDOM_SHARING_MIN_AGE = 71;

export type AgeIssue = "empty" | "range" | "integer";

export type AgeParseResult = { ok: true; age: number } | { ok: false; issue: AgeIssue };

export const AGE_FIELD_MESSAGES: Record<AgeIssue, string> = {
  empty: "Enter an age from 10 to 100.",
  range: "Use an age from 10 to 100.",
  integer: "Use a whole number from 10 to 100.",
};

export const AGE_ORDER_MESSAGE =
  "Use a to age that is the same as or later than the from age.";

export type AgeRangeParseResult =
  | { ok: true; minimumAge: number; maximumAge: number }
  | {
      ok: false;
      minimumIssue?: AgeIssue;
      maximumIssue?: AgeIssue;
      order?: true;
    };

export function parseRequestedAge(value: unknown): AgeParseResult {
  if (value === null || value === undefined) {
    return { ok: false, issue: "empty" };
  }
  const raw = typeof value === "number" ? String(value) : String(value).trim();
  if (raw === "") {
    return { ok: false, issue: "empty" };
  }
  if (!/^\d+$/.test(raw)) {
    return { ok: false, issue: "integer" };
  }
  const age = Number.parseInt(raw, 10);
  if (age < MIN_AGE || age > MAX_AGE) {
    return { ok: false, issue: "range" };
  }
  return { ok: true, age };
}

export function parseContributionAgeRange(
  minimumAge: unknown,
  maximumAge: unknown,
): AgeRangeParseResult {
  const minimum = parseRequestedAge(minimumAge);
  const maximum = parseRequestedAge(maximumAge);
  if (!minimum.ok || !maximum.ok) {
    return {
      ok: false,
      ...(!minimum.ok ? { minimumIssue: minimum.issue } : {}),
      ...(!maximum.ok ? { maximumIssue: maximum.issue } : {}),
    };
  }
  if (minimum.age > maximum.age) {
    return { ok: false, order: true };
  }
  return { ok: true, minimumAge: minimum.age, maximumAge: maximum.age };
}

/** Ages 71–100 use the wisdom-sharing path, not public advice selection. */
export function isWisdomSharingAge(age: number): boolean {
  return age >= WISDOM_SHARING_MIN_AGE && age <= MAX_AGE;
}
