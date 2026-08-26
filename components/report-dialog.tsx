"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/ui/inline-alert";

const REPORT_ERROR = "We couldn’t send the report. Try again.";
const REPORT_RATE_LIMIT = "Please wait a moment before sending another report.";

type ReportDialogProps = {
  open: boolean;
  busy: boolean;
  error: "unavailable" | "rate-limited" | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ReportDialog({ open, busy, error, onConfirm, onCancel }: ReportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    function handleCancel(event: Event) {
      event.preventDefault();
      if (!busy) {
        onCancel();
      }
    }
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [busy, onCancel]);

  return (
    <dialog
      ref={dialogRef}
      className="product-dialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
    >
      <h2 id={titleId} className="type-title m-0">
        Report this advice?
      </h2>
      <p id={bodyId} className="type-body mt-[var(--space-4)] m-0">
        We’ll review it. This won’t notify a public audience.
      </p>
      {error ? (
        <div className="mt-[var(--space-4)]">
          <InlineAlert
            tone="error"
            title={error === "rate-limited" ? REPORT_RATE_LIMIT : REPORT_ERROR}
          />
        </div>
      ) : null}
      <div
        className="mt-[var(--space-6)] flex flex-col"
        style={{ gap: "var(--space-3)" }}
      >
        <Button
          variant="primary"
          type="button"
          busy={busy}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "Loading…" : "Send report"}
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </dialog>
  );
}
