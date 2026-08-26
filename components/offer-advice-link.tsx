import { cn } from "@/lib/cn";

type OfferAdviceLinkProps = {
  className?: string;
  onClick?: () => void;
};

/** Secondary offer-advice control. Uses in-app callback when the loop can open S7. */
export function OfferAdviceLink({ className, onClick }: OfferAdviceLinkProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={cn("button-base button-secondary", className)}
        onClick={onClick}
      >
        Offer advice
      </button>
    );
  }
  return (
    <a href="#offer-advice" className={cn("button-base button-secondary", className)}>
      Offer advice
    </a>
  );
}
