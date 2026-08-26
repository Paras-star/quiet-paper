import { cn } from "@/lib/cn";

type LoadingIndicatorProps = {
  label?: string;
  className?: string;
};

export function LoadingIndicator({
  label = "Loading…",
  className,
}: LoadingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-[var(--space-3)]", className)} role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <p className="type-body m-0">{label}</p>
    </div>
  );
}
