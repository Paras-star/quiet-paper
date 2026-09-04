import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  adviceDocumentTitle,
  experienceDocumentTitle,
  OFFER_TITLE,
  PRIVACY_TITLE,
  RECEIVED_TITLE,
  SITE_DESCRIPTION,
  SITE_LINE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
  SITE_URL,
  TERMS_TITLE,
  wisdomDocumentTitle,
} from "@/lib/site";

describe("production site identity", () => {
  it("uses A Word for You and the public production origin", () => {
    expect(SITE_ORIGIN).toBe("https://awordforyou.com");
    expect(SITE_URL).toBe("https://awordforyou.com/");
    expect(SITE_NAME).toBe("A Word for You");
    expect(SITE_LINE).toBe("A place for advice worth passing on.");
    expect(SITE_TITLE).toBe("A Word for You — Life Advice for Every Age");
    expect(SITE_DESCRIPTION).toBe(
      "A Word for You is a place for advice worth passing on. Enter an age from 10 to 100 to read one piece of life advice, or to share something you’ve learned. No account required.",
    );
    expect(PRIVACY_TITLE).toBe("Privacy — A Word for You");
    expect(TERMS_TITLE).toBe("Terms — A Word for You");
    expect(SITE_ORIGIN).not.toContain("quiet-paper");
    expect(SITE_NAME).not.toContain("Quiet Paper");
  });
});

describe("document titles after a valid age", () => {
  it("uses the advice pattern for ages 10–70 and the wisdom pattern for 71–100", () => {
    expect(adviceDocumentTitle(25)).toBe("Life Advice for Age 25 — A Word for You");
    expect(experienceDocumentTitle(10)).toBe("Life Advice for Age 10 — A Word for You");
    expect(experienceDocumentTitle(70)).toBe("Life Advice for Age 70 — A Word for You");
    expect(wisdomDocumentTitle(71)).toBe("Wisdom for Age 71 — A Word for You");
    expect(experienceDocumentTitle(71)).toBe("Wisdom for Age 71 — A Word for You");
    expect(experienceDocumentTitle(82)).toBe("Wisdom for Age 82 — A Word for You");
    expect(experienceDocumentTitle(100)).toBe("Wisdom for Age 100 — A Word for You");
    expect(OFFER_TITLE).toBe("Offer Advice — A Word for You");
    expect(RECEIVED_TITLE).toBe("Received — A Word for You");
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
  it("indexes the homepage and public legal pages, not per-age URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toEqual([
      SITE_URL,
      `${SITE_ORIGIN}/privacy`,
      `${SITE_ORIGIN}/terms`,
    ]);
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
    expect(layout).toContain("SITE_NAME");
    expect(layout).toContain("summary_large_image");
    expect(layout).not.toContain("json-ld");
    expect(layout).not.toContain('"Age · Life advice"');
  });
});

describe("brand assets", () => {
  it("keeps the supplied logo and derived icon/OG files", () => {
    const original = readFileSync("public/brand/a-word-for-you-logo.png");
    expect(original.length).toBeGreaterThan(1000);
    expect(readFileSync("app/icon.png").length).toBeGreaterThan(1000);
    expect(readFileSync("app/apple-icon.png").length).toBeGreaterThan(1000);
    expect(readFileSync("app/opengraph-image.png").length).toBeGreaterThan(1000);
    expect(readFileSync("app/twitter-image.png").length).toBeGreaterThan(1000);
    expect(readFileSync("app/opengraph-image.alt.txt", "utf8")).toContain("A Word for You");
    expect(readFileSync("app/twitter-image.alt.txt", "utf8")).toContain(
      "A place for advice worth passing on.",
    );
  });
});

describe("visitor-facing chrome", () => {
  it("uses the brand logo in the header and does not overwrite the homepage title on landing", () => {
    const header = readFileSync("components/site-header.tsx", "utf8");
    expect(header).toContain("SITE_NAME");
    expect(header).toContain("SITE_LOGO_SRC");
    expect(header).toContain('alt=""');
    expect(header).toContain("aria-label={SITE_NAME}");
    expect(header).not.toContain("the site");
    const landing = readFileSync("components/age-landing.tsx", "utf8");
    expect(landing).toContain("Advice for the age you are.");
    expect(landing).toContain("SITE_LINE");
    const experience = readFileSync("components/advice-experience.tsx", "utf8");
    expect(experience).toContain("SITE_TITLE");
    expect(experience).toContain("experienceDocumentTitle");
    expect(experience).not.toContain("Age · Life advice");
  });
});
