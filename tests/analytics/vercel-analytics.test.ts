import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("Vercel Web Analytics", () => {
  it("adds the official package as a dependency", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(pkg.dependencies["@vercel/analytics"]).toBeTruthy();
    expect(JSON.stringify(pkg)).not.toMatch(/speed-insights/i);
    expect(JSON.stringify(pkg)).not.toMatch(/google-analytics|gtag|plausible/i);
  });

  it("mounts the Next.js Analytics component in the root layout without custom events", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain('from "@vercel/analytics/next"');
    expect(layout).toContain("<Analytics />");
    expect(layout).not.toContain("track(");
    expect(layout).not.toContain("beforeSend");
    expect(layout).not.toMatch(/speed-insights/i);
  });
});
