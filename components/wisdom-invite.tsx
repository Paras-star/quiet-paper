import { Button } from "@/components/ui/button";

type WisdomInviteProps = {
  age: number;
  onChangeAge: () => void;
  onOfferAdvice: () => void;
};

export function WisdomInvite({ age, onChangeAge, onOfferAdvice }: WisdomInviteProps) {
  return (
    <div aria-live="polite">
      <p className="type-context m-0">For age {age}.</p>
      <h1 className="type-title mt-[var(--space-5)] m-0">
        You’ve lived through experiences younger people haven’t.
      </h1>
      <p className="type-body mt-[var(--space-5)] m-0">
        Share something you’ve learned that might help them. We’ll review it before it can appear.
      </p>
      <div
        className="mt-[var(--space-7)] flex flex-col"
        style={{ gap: "var(--space-3)" }}
      >
        <Button variant="primary" type="button" onClick={onOfferAdvice}>
          Offer advice
        </Button>
        <Button variant="secondary" type="button" onClick={onChangeAge}>
          Change age
        </Button>
      </div>
    </div>
  );
}