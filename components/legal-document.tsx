import type { ReactNode } from "react";
import { PageColumn } from "@/components/page-column";

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalDocument({ title, lastUpdated, children }: LegalDocumentProps) {
  return (
    <PageColumn>
      <article>
        <h1 className="type-title m-0">{title}</h1>
        <p className="type-meta mt-[var(--space-4)] m-0">Last updated: {lastUpdated}</p>
        <div className="mt-[var(--space-6)] flex flex-col" style={{ gap: "var(--space-6)" }}>
          {children}
        </div>
      </article>
    </PageColumn>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="type-ui m-0">{title}</h2>
      <div className="mt-[var(--space-3)] flex flex-col" style={{ gap: "var(--space-3)" }}>
        {children}
      </div>
    </section>
  );
}
