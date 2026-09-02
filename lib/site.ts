import type { Metadata } from "next";

/** Production origin for canonical URLs, Open Graph, robots, and sitemap. */
export const SITE_ORIGIN = "https://quiet-paper.vercel.app";

/** Canonical homepage URL, including the trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}/`;

export const SITE_NAME = "Quiet Paper";

export const SITE_TITLE = "Quiet Paper · Random life advice by age";

export const SITE_DESCRIPTION =
  "Quiet Paper is a random life-advice site organized by age. Enter an age from 10 to 100 to receive one piece of advice. No account required.";

/** Public legal pages. Date is calendar-day, not a live clock. */
export const LEGAL_LAST_UPDATED = "2 September 2026";

export const PRIVACY_PATH = "/privacy";
export const TERMS_PATH = "/terms";

export const PRIVACY_TITLE = "Privacy · Quiet Paper";
export const PRIVACY_DESCRIPTION =
  "How Quiet Paper handles information on this public random life-advice site. You can read advice without creating an account.";

export const TERMS_TITLE = "Terms · Quiet Paper";
export const TERMS_DESCRIPTION =
  "Terms and disclaimer for Quiet Paper. Advice is for information only and is not professional medical, mental-health, legal, or financial advice.";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${SITE_ORIGIN}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en",
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
