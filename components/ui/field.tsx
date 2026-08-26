import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  labelId?: string;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
  className?: string;
};

export function Field({
  label,
  htmlFor,
  labelId,
  hint,
  hintId,
  error,
  errorId,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap: "var(--space-2)" }}>
      <label id={labelId} htmlFor={htmlFor} className="type-ui text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="type-meta m-0">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="type-ui m-0" style={{ color: "var(--qp-danger)" }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
