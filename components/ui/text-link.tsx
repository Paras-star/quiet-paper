import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function TextLink({ className, children, ...props }: TextLinkProps) {
  return (
    <a className={cn("button-base button-tertiary", className)} {...props}>
      {children}
    </a>
  );
}
