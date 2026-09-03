import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal-document";
import {
  LEGAL_LAST_UPDATED,
  pageMetadata,
  TERMS_DESCRIPTION,
  TERMS_PATH,
  TERMS_TITLE,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata(TERMS_PATH, TERMS_TITLE, TERMS_DESCRIPTION);

export default function TermsPage() {
  return (
    <LegalDocument title="Terms and disclaimer" lastUpdated={LEGAL_LAST_UPDATED}>
      <LegalSection title="What A Word for You provides">
        <p className="type-body m-0">
          A Word for You provides general life advice and perspectives for information
          only. Pieces of advice are chosen at random for an age you enter.
        </p>
      </LegalSection>
      <LegalSection title="Not professional advice">
        <p className="type-body m-0">
          This is not medical, mental-health, legal, financial, or other professional
          advice. Use your own judgment. If you need help, speak with a qualified
          professional. If you are in danger or in distress, contact local emergency
          services.
        </p>
      </LegalSection>
      <LegalSection title="No guarantee">
        <p className="type-body m-0">
          We do not promise that any piece of advice is accurate, complete, or
          suitable for you or for every person.
        </p>
      </LegalSection>
      <LegalSection title="Community submissions">
        <p className="type-body m-0">
          Some advice may come from visitors. Submissions are user-generated. They
          may be reviewed, accepted, rejected, removed, or otherwise moderated.
          Sending advice does not mean it will appear on the site.
        </p>
      </LegalSection>
      <LegalSection title="Submission rules">
        <p className="type-body m-0">
          Do not submit content that is abusive, illegal, harmful, hateful,
          fraudulent, or that includes personal information about you or anyone
          else. Do not use submissions to contact, exploit, or solicit anyone,
          especially minors.
        </p>
        <p className="type-body m-0">
          A Word for You may remove or restrict content that breaks these rules, and
          may refuse submissions that cannot be published.
        </p>
      </LegalSection>
      <LegalSection title="About this page">
        <p className="type-body m-0">
          This page is a general disclaimer. It is not legal advice for a particular
          country or situation.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
