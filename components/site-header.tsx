import Link from "next/link";
import { PageColumn } from "@/components/page-column";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <PageColumn className="flex items-center py-[var(--space-4)]">
        <Link
          href="/"
          aria-label="Home"
          className="type-ui inline-flex min-h-[44px] min-w-[44px] items-center text-ink no-underline"
        >
          the site
        </Link>
      </PageColumn>
    </header>
  );
}
