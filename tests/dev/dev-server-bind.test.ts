import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("dev server bind and origins", () => {
  it("binds Next.js on all interfaces so the hosted preview proxy can connect", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(pkg.scripts.dev).toMatch(/--hostname 0\.0\.0\.0/);
    expect(pkg.scripts.dev).toMatch(/--port 43123/);
    expect(pkg.scripts.start).toMatch(/--hostname 0\.0\.0\.0/);
  });

  it("allowlists 127.0.0.1 and the agent preview host for dev client chunks", () => {
    const config = readFileSync("next.config.ts", "utf8");
    expect(config).toContain("allowedDevOrigins");
    expect(config).toContain("127.0.0.1");
    expect(config).toContain("*.agent.cvm.dev");
  });

  it("allowlists preview origins so Server Actions are not aborted by the proxy host mismatch", () => {
    const config = readFileSync("next.config.ts", "utf8");
    expect(config).toContain("serverActions");
    expect(config).toContain("allowedOrigins");
    expect(config).toContain("*.agent.cvm.dev");
    expect(config).toContain("*.cursorvm.com");
  });
});
