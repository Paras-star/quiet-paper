import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

describe("production site identity", () => {
  it("uses the current Vercel production origin and trailing-slash homepage", () => {
    expect(SITE_ORIGIN).toBe("https://quiet-paper.vercel.app");
    expect(SITE_URL).toBe("https://quiet-paper.vercel.app/");
    expect(SITE_NAME).toBe("Quiet Paper");
    expect(SITE_TITLE).toMatch(/Quiet Paper/);
    expect(SITE_TITLE.toLowerCase()).toMatch(/age/);
    expect(SITE_DESCRIPTION.toLowerCase()).toMatch(/random life-advice/);
    expect(SITE_DESCRIPTION.toLowerCase()).toMatch(/age/);
  });
});

describe("robots.txt", () => {
  it("allows public crawling and points at the production sitemap", () => {
    const file = robots();
    expect(file.host).toBe(SITE_ORIGIN);
    expect(file.sitemap).toBe(`${SITE_ORIGIN}/sitemap.xml`);
    expect(file.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
  });
});

describe("sitemap.xml", () => {
  it("indexes only the homepage and does not emit per-age URLs", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.url).toBe(SITE_URL);
    expect(JSON.stringify(entries)).not.toMatch(/\/age\//);
  });
});

describe("root layout metadata", () => {
  it("exports Open Graph, Twitter, and canonical fields from the site constants", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("metadataBase");
    expect(layout).toContain("openGraph");
    expect(layout).toContain("twitter");
    expect(layout).toContain("canonical");
    expect(layout).toContain("SITE_TITLE");
    expect(layout).toContain("SITE_DESCRIPTION");
    expect(layout).toContain("SITE_URL");
    expect(layout).not.toContain('"Age · Life advice"');
  });
});
