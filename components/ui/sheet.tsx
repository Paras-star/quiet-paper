import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SheetProps = {
  children: ReactNode;
  className?: string;
};

/** Optional raised paper. Quiet Paper prefers type on the canvas; use sparingly. */
export function Sheet({ children, className }: SheetProps) {
  return <div className={cn("sheet-surface", className)}>{children}</div>;
}
