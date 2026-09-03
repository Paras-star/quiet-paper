import { PageColumn } from "@/components/page-column";
import { TextLink } from "@/components/ui/text-link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-[var(--space-9)] border-t border-border sm:mt-[var(--space-10)]">
      <PageColumn className="flex flex-col gap-[var(--space-4)] py-[var(--space-8)]">
        <p className="type-ui m-0">{SITE_NAME}</p>
        <nav aria-label="Footer">
          <ul className="m-0 flex list-none flex-col gap-[var(--space-2)] p-0 sm:flex-row sm:flex-wrap sm:gap-[var(--space-5)]">
            <li>
              <TextLink href="/privacy">Privacy</TextLink>
            </li>
            <li>
              <TextLink href="/terms">Terms</TextLink>
            </li>
            <li>
              <TextLink href="/#offer-advice">Offer advice</TextLink>
            </li>
            <li>
              <TextLink href="#guidelines">Guidelines</TextLink>
            </li>
          </ul>
        </nav>
        <p className="type-meta m-0">
          Guidelines is a placeholder until that page exists. Offer advice opens the
          contribution form.
        </p>
        <p className="type-meta m-0">
          This is personal opinion, not professional advice. If you are in danger or in
          distress, contact local emergency services or a qualified professional.
        </p>
      </PageColumn>
    </footer>
  );
}
