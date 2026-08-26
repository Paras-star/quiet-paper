import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "error" | "success" | "warning";

type InlineAlertProps = {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  className?: string;
};

export function InlineAlert({ tone = "info", title, children, className }: InlineAlertProps) {
  const role = tone === "error" ? "alert" : "status";
  return (
    <div className={cn("inline-alert", className)} data-tone={tone} role={role}>
      <span aria-hidden="true" className="mt-0.5 select-none">
        {tone === "error" ? "!" : tone === "success" ? "✓" : "i"}
      </span>
      <div>
        <p className="type-ui m-0 text-current">{title}</p>
        {children ? (
          <p className="type-body m-0 mt-[var(--space-2)] text-current">{children}</p>
        ) : null}
      </div>
    </div>
  );
}
