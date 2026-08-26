import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
describe("credential hygiene", () => {
  it("keeps .env.example empty and server-only", () => {
    const example = readFileSync(".env.example", "utf8");
    expect(example).toContain("SUPABASE_URL=");
    expect(example).toContain("SUPABASE_SERVICE_ROLE_KEY=");
    expect(example).not.toMatch(/SUPABASE_URL=.+/);
    expect(example).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY=.+/);
    expect(example).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  });
  it("does not name a public service-role env var in application code", () => {
    const server = readFileSync("lib/data/supabase-server.ts", "utf8");

    const clientFactory = readFileSync("lib/data/service-role-client.ts", "utf8");
    expect(server).toContain('import "server-only"');
    expect(server).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
    expect(clientFactory).toContain("process.env.SUPABASE_SERVICE_ROLE_KEY");
    expect(clientFactory).toContain("process.env.SUPABASE_URL");
    expect(clientFactory).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  });
});
