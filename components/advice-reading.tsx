"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { submitAdviceReport } from "@/app/actions/report";
import { OfferAdviceLink } from "@/components/offer-advice-link";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/ui/inline-alert";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

const NEXT_ERROR = "We couldn’t load another piece. Check your connection and try again.";
const RATE_LIMIT_ERROR = "Please wait a moment before requesting another piece.";
const REPORT_THANKS = "Thanks. We’ll look at this.";

type AdviceReadingProps = {
  age: number;
  itemId: string | null;
  body: string | null;
  loading: boolean;
  nextError: boolean;
  firstLoadError: boolean;
  reportThanks: boolean;
  rateLimited: boolean;
  onNext: () => void;
  onRetry: () => void;
  onChangeAge: () => void;
  onOfferAdvice: () => void;
  onReported: (id: string) => void;
};

export function AdviceReading({
  age,
  itemId,
  body,
  loading,
  nextError,
  firstLoadError,
  reportThanks,
  rateLimited,
  onNext,
  onRetry,
  onChangeAge,
  onOfferAdvice,
  onReported,
}: AdviceReadingProps) {
  const articleRef = useRef<HTMLElement>(null);
  const reportTriggerRef = useRef<HTMLButtonElement>(null);
  const previousBody = useRef<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState<"unavailable" | "rate-limited" | null>(null);

  useEffect(() => {
    if (!body || loading) {
      return;
    }
    if (previousBody.current !== body) {
      articleRef.current?.focus();
    }
    previousBody.current = body;
  }, [body, loading]);

  const closeDialog = useCallback(() => {
    if (reportBusy) {
      return;
    }
    setDialogOpen(false);
    setReportError(null);
    reportTriggerRef.current?.focus();
  }, [reportBusy]);

  async function handleConfirmReport() {
    if (!itemId || reportBusy) {
      return;
    }
    setReportBusy(true);
    setReportError(null);
    const result = await submitAdviceReport({ adviceId: itemId });
    setReportBusy(false);
    if (result.kind === "rate-limited") {
      setReportError("rate-limited");
      return;
    }
    if (result.kind !== "received") {
      setReportError("unavailable");
      return;
    }
    setDialogOpen(false);
    setReportError(null);
    onReported(itemId);
  }

  return (
    <>
      <Button variant="tertiary" type="button" onClick={onChangeAge} disabled={loading}>
        Change age
      </Button>
      <h1 className="type-context mt-[var(--space-5)] m-0">Advice for age {age}.</h1>
      <div className="mt-[var(--space-4)]" aria-busy={loading || undefined}>
        {reportThanks ? (
          <div className="mb-[var(--space-5)]">
            <InlineAlert tone="success" title={REPORT_THANKS} />
          </div>
        ) : null}
        {firstLoadError ? (
          <InlineAlert tone="error" title={rateLimited ? RATE_LIMIT_ERROR : NEXT_ERROR} />
        ) : body ? (
          <article
            ref={articleRef}
            tabIndex={-1}
            aria-live="polite"
            className="outline-none"
          >
            <p className="type-advice m-0 whitespace-pre-wrap">{body}</p>
          </article>
        ) : (
          <LoadingIndicator label="Loading advice…" />
        )}
        {body && loading ? (
          <div className="mt-[var(--space-5)]">
            <LoadingIndicator label="Loading advice…" />
          </div>
        ) : null}
        {nextError || (rateLimited && body) ? (
          <div className="mt-[var(--space-5)]">
            <InlineAlert
              tone="error"
              title={rateLimited ? RATE_LIMIT_ERROR : NEXT_ERROR}
            />
          </div>
        ) : null}
      </div>
      <div
        className="mt-[var(--space-7)] flex flex-col"
        style={{ gap: "var(--space-3)" }}
      >
        {firstLoadError ? (
          <Button variant="primary" type="button" onClick={onRetry} busy={loading}>
            {loading ? "Loading…" : "Try again"}
          </Button>
        ) : (
          <Button
            variant="primary"
            type="button"
            onClick={onNext}
            busy={loading}
            disabled={loading || !body}
          >
            {loading ? "Loading…" : "Another piece of advice"}
          </Button>
        )}
        <OfferAdviceLink onClick={onOfferAdvice} />
        {itemId ? (
          <Button
            ref={reportTriggerRef}
            variant="tertiary"
            type="button"
            className="self-start"
            disabled={loading}
            onClick={() => {
              setReportError(null);
              setDialogOpen(true);
            }}
          >
            Report this advice
          </Button>
        ) : null}
      </div>
      <ReportDialog
        open={dialogOpen}
        busy={reportBusy}
        error={reportError}
        onConfirm={() => {
          void handleConfirmReport();
        }}
        onCancel={closeDialog}
      />
    </>
  );
}
