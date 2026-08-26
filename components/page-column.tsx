import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageColumnProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function PageColumn({ children, as: Tag = "div", className }: PageColumnProps) {
  return <Tag className={cn("page-column", className)}>{children}</Tag>;
}
