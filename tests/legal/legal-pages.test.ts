import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { metadata as privacyMetadata } from "@/app/privacy/page";
import { metadata as termsMetadata } from "@/app/terms/page";
import {
  LEGAL_LAST_UPDATED,
  pageMetadata,
  PRIVACY_DESCRIPTION,
  PRIVACY_PATH,
  PRIVACY_TITLE,
  SITE_ORIGIN,
  TERMS_DESCRIPTION,
  TERMS_PATH,
  TERMS_TITLE,
} from "@/lib/site";

describe("legal page metadata", () => {
  it("uses indexable titles, descriptions, and canonical URLs", () => {
    expect(privacyMetadata).toEqual(
      pageMetadata(PRIVACY_PATH, PRIVACY_TITLE, PRIVACY_DESCRIPTION),
    );
    expect(termsMetadata).toEqual(pageMetadata(TERMS_PATH, TERMS_TITLE, TERMS_DESCRIPTION));
    expect(privacyMetadata.robots).toEqual({ index: true, follow: true });
    expect(termsMetadata.robots).toEqual({ index: true, follow: true });
    expect(privacyMetadata.alternates?.canonical).toBe(`${SITE_ORIGIN}/privacy`);
    expect(termsMetadata.alternates?.canonical).toBe(`${SITE_ORIGIN}/terms`);
    expect(PRIVACY_TITLE).toBe("Privacy — A Word for You");
    expect(TERMS_TITLE).toBe("Terms — A Word for You");
    expect(SITE_ORIGIN).toBe("https://awordforyou.com");
  });
});

describe("privacy policy page", () => {
  const source = readFileSync("app/privacy/page.tsx", "utf8");

  it("covers the public advice site, voluntary submissions, hosting, and contact", () => {
    expect(source).toContain("LEGAL_LAST_UPDATED");
    expect(LEGAL_LAST_UPDATED).toBe("2 September 2026");
    expect(source).toMatch(/public website that shows random life advice/i);
    expect(source).toMatch(/without creating an account/i);
    expect(source).toMatch(/offer a piece of advice/i);
    expect(source).toMatch(/report a piece of advice/i);
    expect(source).toMatch(/stored so it can be reviewed/i);
    expect(source).toMatch(/network address/i);
    expect(source).toMatch(/Vercel/);
    expect(source).toMatch(/Supabase/);
    expect(source).toMatch(/contact information\s+provided on this site/i);
    expect(source).not.toMatch(/mailto:/);
    expect(source).toMatch(/Vercel Web Analytics/i);
    expect(source).toMatch(/basic page views and\s+traffic/i);
    expect(source).toMatch(/We do not use advertising, newsletters, or visitor accounts/i);
    expect(source).not.toMatch(/do not currently use analytics/i);
  });

  it("does not invent advertising, accounts, cookies, or a contact address", () => {
    expect(source).toMatch(/We do not use advertising, newsletters, or visitor accounts/i);
    expect(source).not.toMatch(/tracking cookies/i);
    expect(source).not.toMatch(/@quiet-paper/);
    expect(source).not.toMatch(/Quiet Paper/);
    expect(source).toContain("A Word for You");
    expect(source).not.toMatch(/Acme|Ltd|LLC|Incorporated/);
  });
});

describe("terms page", () => {
  const source = readFileSync("app/terms/page.tsx", "utf8");

  it("covers the informational disclaimer, community moderation, and submission rules", () => {
    expect(source).toContain("LEGAL_LAST_UPDATED");
    expect(source).toMatch(/general life advice and perspectives for information/i);
    expect(source).toMatch(/not medical, mental-health, legal, financial/i);
    expect(source).toMatch(/qualified\s+professional/i);
    expect(source).toMatch(/user-generated/i);
    expect(source).toMatch(/reviewed, accepted, rejected, removed/i);
    expect(source).toMatch(/accurate, complete, or\s+suitable/i);
    expect(source).toMatch(/abusive, illegal, harmful/i);
    expect(source).toMatch(/remove or restrict content/i);
    expect(source).not.toMatch(/mailto:/);
    expect(source).not.toMatch(/governing law/i);
    expect(source).not.toMatch(/Quiet Paper/);
    expect(source).toContain("A Word for You");
  });
});

describe("footer legal links", () => {
  const source = readFileSync("components/site-footer.tsx", "utf8");

  it("points Privacy and Terms at the public pages without changing other footer hrefs", () => {
    expect(source).toContain('href="/privacy"');
    expect(source).toContain('href="/terms"');
    expect(source).toContain('href="/#offer-advice"');
    expect(source).toContain('href="#guidelines"');
    expect(source).not.toContain('href="#how-this-works"');
    expect(source).not.toContain("How this works");
    expect(source).toContain("SITE_NAME");
    expect(source).not.toContain('href="#privacy"');
    expect(source).not.toMatch(/\bU12\b/);
  });
});

describe("visitor-facing copy", () => {
  it("does not expose the U2 tracker id in the contribution form", () => {
    const source = readFileSync("components/offer-advice-form.tsx", "utf8");
    expect(source).toContain("provisional engineering");
    expect(source).toContain("maximum");
    expect(source).not.toMatch(/\bU2\b/);
  });
});

describe("legal document chrome", () => {
  it("prints a last-updated line", () => {
    const source = readFileSync("components/legal-document.tsx", "utf8");
    expect(source).toContain("Last updated:");
  });
});
