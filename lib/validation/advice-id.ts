const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type AdviceIdParseResult = { ok: true; id: string } | { ok: false };

export function parseAdviceId(value: unknown): AdviceIdParseResult {
  if (typeof value !== "string") {
    return { ok: false };
  }
  const id = value.trim();
  if (!UUID.test(id)) {
    return { ok: false };
  }
  return { ok: true, id };
}
