import type { Metadata } from "next";

/** Production origin for canonical URLs, Open Graph, robots, and sitemap. */
export const SITE_ORIGIN = "https://awordforyou.com";

/** Canonical homepage URL, including the trailing slash. */
export const SITE_URL = `${SITE_ORIGIN}/`;

export const SITE_NAME = "A Word for You";

export const SITE_LINE = "A place for advice worth passing on.";

export const SITE_TITLE = "A Word for You — Life Advice for Every Age";

export const SITE_DESCRIPTION =
  "A Word for You is a place for advice worth passing on. Enter an age from 10 to 100 to read one piece of life advice, or to share something you’ve learned. No account required.";

export const OFFER_TITLE = "Offer Advice — A Word for You";

export const RECEIVED_TITLE = "Received — A Word for You";

/** Public legal pages. Date is calendar-day, not a live clock. */
export const LEGAL_LAST_UPDATED = "2 September 2026";

export const PRIVACY_PATH = "/privacy";
export const TERMS_PATH = "/terms";

export const PRIVACY_TITLE = "Privacy — A Word for You";
export const PRIVACY_DESCRIPTION =
  "How A Word for You handles information. You can read advice without creating an account.";

export const TERMS_TITLE = "Terms — A Word for You";
export const TERMS_DESCRIPTION =
  "Terms and disclaimer for A Word for You. This is general life advice, not professional medical, mental-health, legal, or financial advice.";

export function adviceDocumentTitle(age: number): string {
  return `Life Advice for Age ${age} — ${SITE_NAME}`;
}

export function wisdomDocumentTitle(age: number): string {
  return `Wisdom for Age ${age} — ${SITE_NAME}`;
}

/** Tab title after a valid age. 10–70 use the advice pattern; 71–100 use wisdom. */
export function experienceDocumentTitle(age: number): string {
  if (age >= 71 && age <= 100) {
    return wisdomDocumentTitle(age);
  }
  return adviceDocumentTitle(age);
}

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
