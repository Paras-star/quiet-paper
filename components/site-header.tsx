import Image from "next/image";
import Link from "next/link";
import { PageColumn } from "@/components/page-column";
import {
  SITE_LOGO_HEIGHT,
  SITE_LOGO_SRC,
  SITE_LOGO_WIDTH,
  SITE_NAME,
} from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <PageColumn className="flex items-center py-[var(--space-3)] sm:py-[var(--space-4)]">
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="inline-flex min-h-[44px] min-w-[44px] items-center no-underline"
        >
          <Image
            src={SITE_LOGO_SRC}
            alt=""
            width={SITE_LOGO_WIDTH}
            height={SITE_LOGO_HEIGHT}
            priority
            unoptimized
            className="h-14 w-auto sm:h-16"
          />
        </Link>
      </PageColumn>
    </header>
  );
}
