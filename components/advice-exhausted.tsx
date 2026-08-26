import { OfferAdviceLink } from "@/components/offer-advice-link";
import { Button } from "@/components/ui/button";

type AdviceExhaustedProps = {
  age: number;
  onChangeAge: () => void;
  onOfferAdvice: () => void;
};

export function AdviceExhausted({ age, onChangeAge, onOfferAdvice }: AdviceExhaustedProps) {
  return (
    <div aria-live="polite">
      <h1 className="type-title m-0">That’s all we have for age {age} right now.</h1>
      <p className="type-body mt-[var(--space-5)] m-0">
        You can change the age, or offer advice for someone else.
      </p>
      <div
        className="mt-[var(--space-7)] flex flex-col"
        style={{ gap: "var(--space-3)" }}
      >
        <Button variant="primary" type="button" onClick={onChangeAge}>
          Change age
        </Button>
        <OfferAdviceLink onClick={onOfferAdvice} />
      </div>
    </div>
  );
}
