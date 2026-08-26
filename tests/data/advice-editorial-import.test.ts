import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADVICE_BODY_MAX_CHARS } from "@/lib/validation/advice-body";
import {

  importEditorialRecords, importEditorialText, mapEditorialRow,
} from "@/lib/data/advice-editorial-import";
const PUBLISHED_AT = "2026-08-25T12:00:00.000Z";
const ITEM_ID = "550e8400-e29b-41d4-a716-446655440000";
const EXAMPLE_BODY = "EXAMPLE fixture only. This is not the founder library.";
type StoredRow = {
  id?: string;
  body?: string;
  minimum_age?: number;
  maximum_age?: number;
};
function createMockAdviceClient(existing: StoredRow[] = []) {
  const store: StoredRow[] = existing.map((row) => ({ ...row }));

  const inserts: unknown[] = [];
  return {
    inserts, store, from() {
      const filters: Record<string, unknown> = {};
      const chain = {
        select: () => chain, eq: (column: string, value: unknown) => {
          filters[column] = value;
          return chain;
        },
        maybeSingle: async () => {
          const found = store.find((row) => Object.entries(filters).every(([column, value]) => row[column as keyof StoredRow] === value),
          );
          return { data: found ? { id: found.id ?? "existing" } : null, error: null };
        },

        insert: async (row: StoredRow) => {
          inserts.push(row);
          store.push({
            ...row, id: row.id ?? `generated-${inserts.length}`,
          });
          return { error: null };
        },
      };
      return chain;
    },
  };
}
describe("mapEditorialRow", () => {
  it("maps a valid row to editorial, approved, and published_at", () => {
    const outcome = mapEditorialRow( {
        body: `  ${EXAMPLE_BODY}  `,

        minimum_age: 18, maximum_age: 40, status: "pending", source_type: "community", email: "ignore-me@example.com",
      },
      "row 1", PUBLISHED_AT, );
    expect(outcome).toEqual({
      kind: "ready", row: "row 1", insert: {
        body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40, source_type: "editorial", status: "approved",

        published_at: PUBLISHED_AT,
      },
    });
  });
  it("rejects invalid ages and inverted ranges", () => {
    expect( mapEditorialRow({ body: EXAMPLE_BODY, minimum_age: 9, maximum_age: 40 }, "row 1", PUBLISHED_AT),
    ).toMatchObject({ kind: "invalid", message: expect.stringContaining("minimum_age") });
    expect( mapEditorialRow({ body: EXAMPLE_BODY, minimum_age: 40, maximum_age: 18 }, "row 2", PUBLISHED_AT),
    ).toMatchObject({ kind: "invalid", message: expect.stringContaining("minimum_age is after maximum_age") });
  });
  it("rejects empty and oversized bodies", () => {
    expect( mapEditorialRow({ body: "   ", minimum_age: 18, maximum_age: 40 }, "row 1", PUBLISHED_AT),
    ).toMatchObject({ kind: "invalid", message: expect.stringContaining("body (empty)") });

    expect( mapEditorialRow( { body: "a".repeat(ADVICE_BODY_MAX_CHARS + 1), minimum_age: 18, maximum_age: 40 },
        "row 2", PUBLISHED_AT, ),
    ).toMatchObject({ kind: "invalid", message: expect.stringContaining("body (too-long)") });
  });
  it("preserves a supplied valid UUID and rejects a malformed id", () => {
    expect( mapEditorialRow( { id: ITEM_ID, body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 },
        "row 1", PUBLISHED_AT, ),
    ).toMatchObject({ kind: "ready", insert: { id: ITEM_ID } });
    expect( mapEditorialRow(

        { id: "not-a-uuid", body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 },
        "row 2", PUBLISHED_AT, ),
    ).toMatchObject({ kind: "invalid", message: "id is not a valid UUID." });
  });
});
describe("importEditorialRecords", () => {
  let client: ReturnType<typeof createMockAdviceClient>;
  beforeEach(() => {
    client = createMockAdviceClient();
  });
  it("inserts only editorial approved rows and ignores extra input fields", async () => {
    const summary = await importEditorialRecords( [ {

          body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40, status: "pending", source_type: "community", category: "ignored", email: "ignore-me@example.com",
        },
      ],
      { client, publishedAt: PUBLISHED_AT },
    );
    expect(summary).toEqual({ imported: 1, skipped: 0, invalid: 0, errors: [] });
    expect(client.inserts).toEqual([ {
        body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40, source_type: "editorial",

        status: "approved", published_at: PUBLISHED_AT,
      },
    ]);
  });
  it("does not insert invalid rows", async () => {
    const summary = await importEditorialRecords( [ { body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 },
        { body: EXAMPLE_BODY, minimum_age: 9, maximum_age: 40 },
        { body: "   ", minimum_age: 18, maximum_age: 40 },
      ],
      { client, publishedAt: PUBLISHED_AT },
    );
    expect(summary.imported).toBe(1);
    expect(summary.invalid).toBe(2);
    expect(summary.errors).toHaveLength(2);

    expect(client.inserts).toHaveLength(1);
  });
  it("skips a duplicate UUID without overwriting", async () => {
    client = createMockAdviceClient([{ id: ITEM_ID, body: "Already present.", minimum_age: 10, maximum_age: 20 }]);
    const summary = await importEditorialRecords( [{ id: ITEM_ID, body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 }],
      { client, publishedAt: PUBLISHED_AT },
    );
    expect(summary).toMatchObject({ imported: 0, skipped: 1, invalid: 0 });
    expect(client.inserts).toEqual([]);
    expect(client.store[0]?.body).toBe("Already present.");
  });
  it("skips a duplicate body and age range without an id", async () => {
    client = createMockAdviceClient([
      {
        id: "11111111-1111-4111-8111-111111111111",
        body: EXAMPLE_BODY,
        minimum_age: 18,
        maximum_age: 40,
      },
    ]);
    const summary = await importEditorialRecords( [{ body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 }],
      { client, publishedAt: PUBLISHED_AT },
    );
    expect(summary).toMatchObject({ imported: 0, skipped: 1, invalid: 0 });
    expect(client.inserts).toEqual([]);
  });
});
describe("importEditorialText", () => {
  it("parses JSON and CSV example fixtures the same way", async () => {
    const jsonClient = createMockAdviceClient();
    const csvClient = createMockAdviceClient();
    const json = `[
      {"id":"${ITEM_ID}","body":"${EXAMPLE_BODY}","minimum_age":18,"maximum_age":40,"status":"pending"}
    ]`;
    const csv = `id,body,minimum_age,maximum_age,status
${ITEM_ID},"${EXAMPLE_BODY}",18,40,pending
`;
    await importEditorialText(json, "json", { client: jsonClient, publishedAt: PUBLISHED_AT });
    await importEditorialText(csv, "csv", { client: csvClient, publishedAt: PUBLISHED_AT });
    expect(jsonClient.inserts).toEqual(csvClient.inserts);
    expect(jsonClient.inserts[0]).toMatchObject({
      id: ITEM_ID, source_type: "editorial", status: "approved",
    });
  });
});
describe("createServiceRoleClient is not required when a client is injected", () => {
  it("does not touch live credentials", async () => {

    const spy = vi.spyOn(await import("@/lib/data/service-role-client"), "createServiceRoleClient");
    const client = createMockAdviceClient();
    await importEditorialRecords( [{ body: EXAMPLE_BODY, minimum_age: 18, maximum_age: 40 }],
      { client, publishedAt: PUBLISHED_AT },
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
