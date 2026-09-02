import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal-document";
import {
  LEGAL_LAST_UPDATED,
  pageMetadata,
  PRIVACY_DESCRIPTION,
  PRIVACY_PATH,
  PRIVACY_TITLE,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  PRIVACY_PATH,
  PRIVACY_TITLE,
  PRIVACY_DESCRIPTION,
);

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy policy" lastUpdated={LEGAL_LAST_UPDATED}>
      <LegalSection title="What this site is">
        <p className="type-body m-0">
          Quiet Paper is a public website that shows random life advice organized by
          age. You can read advice without creating an account.
        </p>
      </LegalSection>
      <LegalSection title="What you can send">
        <p className="type-body m-0">
          You may choose to offer a piece of advice, including the text and an age
          range. You may also report a piece of advice you are viewing. Both are
          voluntary. We do not ask for a name, email address, or other account
          details to do this.
        </p>
      </LegalSection>
      <LegalSection title="How submissions are stored">
        <p className="type-body m-0">
          Offered advice is stored so it can be reviewed before it can appear to
          other visitors. A report is stored against the advice you reported so it
          can be reviewed. Sending something does not mean it will be published.
        </p>
      </LegalSection>
      <LegalSection title="Age">
        <p className="type-body m-0">
          Age is used to choose a relevant piece of advice for that visit. It is not
          used to create a profile of you.
        </p>
      </LegalSection>
      <LegalSection title="Technical information">
        <p className="type-body m-0">
          To keep the site working and to reduce abuse, we may process basic
          technical information, such as a network address, for short-lived security
          and rate limiting.
        </p>
        <p className="type-body m-0">
          Quiet Paper uses Vercel Web Analytics to measure basic page views and
          traffic. We do not use advertising, newsletters, or visitor accounts.
        </p>
      </LegalSection>
      <LegalSection title="Hosting">
        <p className="type-body m-0">
          The site is hosted on Vercel. Advice and related records are stored using
          Supabase. Those providers process information as needed to run their
          services.
        </p>
      </LegalSection>
      <LegalSection title="Questions">
        <p className="type-body m-0">
          If you have a privacy or data question, use the contact information
          provided on this site.
        </p>
        <p className="type-body m-0">
          This page is a general explanation. It is not legal advice for a particular
          country or situation.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
