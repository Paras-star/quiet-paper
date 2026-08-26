/** Provisional engineering ceiling until U2 is decided. Not a product lock. */
export const ADVICE_BODY_MAX_CHARS = 4000;

export type AdviceBodyIssue = "empty" | "too-long";

export type AdviceBodyParseResult =
  | { ok: true; body: string }
  | { ok: false; issue: AdviceBodyIssue };

export const ADVICE_BODY_MESSAGES: Record<AdviceBodyIssue, string> = {
  empty: "Enter the advice.",
  "too-long":
    "This is over the provisional 4000-character engineering maximum. Shorten it and try again. The product character limit is not decided yet.",
};

export function parseAdviceBody(value: unknown): AdviceBodyParseResult {
  if (typeof value !== "string") {
    return { ok: false, issue: "empty" };
  }
  const body = value.trim();
  if (body === "") {
    return { ok: false, issue: "empty" };
  }
  if (body.length > ADVICE_BODY_MAX_CHARS) {
    return { ok: false, issue: "too-long" };
  }
  return { ok: true, body };
}
