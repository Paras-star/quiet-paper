import { Button } from "@/components/ui/button";

type ContributionReceivedProps = {
  primaryLabel: "Back to advice" | "See advice" | "Back";
  onPrimary: () => void;
  onOfferAnother: () => void;
};

export function ContributionReceived({
  primaryLabel,
  onPrimary,
  onOfferAnother,
}: ContributionReceivedProps) {
  return (
    <div aria-live="assertive">
      <h1 className="type-title m-0" style={{ color: "var(--color-success-text)" }}>
        Received — thank you.
      </h1>
      <p className="type-body mt-[var(--space-5)] m-0">
        We’ll review what you sent. If it can be published, it may appear later for visitors in
        that age range. If it cannot, it simply won’t appear. We won’t email you about this.
      </p>
      <div
        className="mt-[var(--space-7)] flex flex-col"
        style={{ gap: "var(--space-3)" }}
      >
        <Button variant="primary" type="button" onClick={onPrimary}>
          {primaryLabel}
        </Button>
        <Button variant="secondary" type="button" onClick={onOfferAnother}>
          Offer another piece
        </Button>
      </div>
    </div>
  );
}
