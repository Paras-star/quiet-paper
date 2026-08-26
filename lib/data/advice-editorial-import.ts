import { parseCsvRecords } from "./csv";
import { createServiceRoleClient } from "./service-role-client";
import { parseAdviceBody } from "../validation/advice-body";
import { parseAdviceId } from "../validation/advice-id";
import { parseContributionAgeRange } from "../validation/age";

export type EditorialInsertRow = {
  id?: string;
  body: string;
  minimum_age: number;
  maximum_age: number;
  source_type: "editorial";
  status: "approved";
  published_at: string;
};

export type EditorialRowOutcome =
  | { kind: "ready"; row: string; insert: EditorialInsertRow }
  | { kind: "invalid"; row: string; message: string };

export type EditorialImportSummary = {
  imported: number;
  skipped: number;
  invalid: number;
  errors: string[];
};

type AdviceFilterChain = {
  eq: (column: string, value: unknown) => AdviceFilterChain;
  maybeSingle: () => PromiseLike<{ data: { id?: string } | null; error: unknown }>;
};

type AdviceTable = {
  select: (columns: string) => AdviceFilterChain;
  insert: (row: EditorialInsertRow) => PromiseLike<{ error: unknown }>;
};

export type AdviceImportClient = {
  from: (table: string) => AdviceTable;
};

export function parseEditorialJson(text: string): unknown[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("JSON file is not valid JSON.");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("JSON file must be an array of objects.");
  }
  return parsed;
}

export function parseEditorialCsv(text: string): unknown[] {
  return parseCsvRecords(text);
}

export function mapEditorialRow(
  raw: unknown,
  rowLabel: string,
  publishedAt: string,
): EditorialRowOutcome {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { kind: "invalid", row: rowLabel, message: "row is not an object." };
  }
  const input = raw as Record<string, unknown>;
  const range = parseContributionAgeRange(input.minimum_age, input.maximum_age);
  const body = parseAdviceBody(input.body);
  if (!range.ok || !body.ok) {
    const parts: string[] = [];
    if (!range.ok) {
      if (range.minimumIssue) {
        parts.push(`minimum_age (${range.minimumIssue})`);
      }
      if (range.maximumIssue) {
        parts.push(`maximum_age (${range.maximumIssue})`);
      }
      if (range.order) {
        parts.push("minimum_age is after maximum_age");
      }
    }
    if (!body.ok) {
      parts.push(`body (${body.issue})`);
    }
    return {
      kind: "invalid",
      row: rowLabel,
      message: parts.join("; ") || "invalid fields.",
    };
  }
  const insert: EditorialInsertRow = {
    body: body.body,
    minimum_age: range.minimumAge,
    maximum_age: range.maximumAge,
    source_type: "editorial",
    status: "approved",
    published_at: publishedAt,
  };
  const rawId = input.id;
  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== "") {
    const parsedId = parseAdviceId(typeof rawId === "string" ? rawId : String(rawId));
    if (!parsedId.ok) {
      return { kind: "invalid", row: rowLabel, message: "id is not a valid UUID." };
    }
    insert.id = parsedId.id;
  }
  return { kind: "ready", row: rowLabel, insert };
}

export async function importEditorialText(
  text: string,
  format: "json" | "csv",
  options: {
    client?: AdviceImportClient | null;
    publishedAt?: string;
  } = {},
): Promise<EditorialImportSummary> {
  const records = format === "json" ? parseEditorialJson(text) : parseEditorialCsv(text);
  return importEditorialRecords(records, options);
}

export async function importEditorialRecords(
  records: unknown[],
  options: {
    client?: AdviceImportClient | null;
    publishedAt?: string;
  } = {},
): Promise<EditorialImportSummary> {
  const publishedAt = options.publishedAt ?? new Date().toISOString();
  const client: AdviceImportClient | null =
    options.client === undefined
      ? (createServiceRoleClient() as AdviceImportClient | null)
      : options.client;
  const errors: string[] = [];
  const ready: Array<{ row: string; insert: EditorialInsertRow }> = [];
  records.forEach((record, index) => {
    const outcome = mapEditorialRow(record, `row ${index + 1}`, publishedAt);
    if (outcome.kind === "invalid") {
      errors.push(`${outcome.row}: ${outcome.message}`);
      return;
    }
    ready.push({ row: outcome.row, insert: outcome.insert });
  });
  const invalid = records.length - ready.length;
  if (!client) {
    errors.push(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them on the operator machine; never use NEXT_PUBLIC_ for the service-role key.",
    );
    return { imported: 0, skipped: 0, invalid, errors };
  }
  let imported = 0;
  let skipped = 0;
  for (const item of ready) {
    const duplicate = await existingAdvice(client, item.insert);
    if (duplicate === "error") {
      errors.push(`${item.row}: could not check for an existing row.`);
      continue;
    }
    if (duplicate) {
      skipped += 1;
      continue;
    }
    const { error } = await client.from("advice").insert(item.insert);
    if (error) {
      errors.push(`${item.row}: insert failed.`);
      continue;
    }
    imported += 1;
  }
  return { imported, skipped, invalid, errors };
}

async function existingAdvice(
  client: AdviceImportClient,
  row: EditorialInsertRow,
): Promise<boolean | "error"> {
  if (row.id) {
    const { data, error } = await client
      .from("advice")
      .select("id")
      .eq("id", row.id)
      .maybeSingle();
    if (error) {
      return "error";
    }
    return Boolean(data);
  }
  const { data, error } = await client
    .from("advice")
    .select("id")
    .eq("body", row.body)
    .eq("minimum_age", row.minimum_age)
    .eq("maximum_age", row.maximum_age)
    .maybeSingle();
  if (error) {
    return "error";
  }
  return Boolean(data);
}
