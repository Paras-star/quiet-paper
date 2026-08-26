"use client";

import { useState, type FormEvent } from "react";
import { submitCommunityAdvice } from "@/app/actions/contribute";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InlineAlert } from "@/components/ui/inline-alert";
import { TextArea } from "@/components/ui/textarea";
import { TextField } from "@/components/ui/text-field";
import {
  ADVICE_BODY_MAX_CHARS,
  ADVICE_BODY_MESSAGES,
  parseAdviceBody,
  type AdviceBodyIssue,
} from "@/lib/validation/advice-body";
import {
  AGE_FIELD_MESSAGES,
  AGE_ORDER_MESSAGE,
  parseContributionAgeRange,
  parseRequestedAge,
  type AgeIssue,
} from "@/lib/validation/age";

const SEND_ERROR = "We couldn’t send this. Check your connection and try again.";
const SEND_RATE_LIMIT = "Please wait a moment before sending again.";

type OfferAdviceFormProps = {
  initialMinAge: string;
  initialMaxAge: string;
  backLabel: "Back to advice" | "Back";
  onBack: () => void;
  onReceived: () => void;
};

export function OfferAdviceForm({
  initialMinAge,
  initialMaxAge,
  backLabel,
  onBack,
  onReceived,
}: OfferAdviceFormProps) {
  const [minAge, setMinAge] = useState(initialMinAge);
  const [maxAge, setMaxAge] = useState(initialMaxAge);
  const [body, setBody] = useState("");
  const [minError, setMinError] = useState<AgeIssue | null>(null);
  const [maxError, setMaxError] = useState<AgeIssue | null>(null);
  const [orderError, setOrderError] = useState(false);
  const [bodyError, setBodyError] = useState<AdviceBodyIssue | null>(null);
  const [sendError, setSendError] = useState<"unavailable" | "rate-limited" | null>(null);
  const [busy, setBusy] = useState(false);

  function focusFirstInvalid(next: {
    min?: AgeIssue | null;
    max?: AgeIssue | null;
    order?: boolean;
    body?: AdviceBodyIssue | null;
  }) {
    if (next.min) {
      document.getElementById("from-age")?.focus();
      return;
    }
    if (next.max || next.order) {
      document.getElementById("to-age")?.focus();
      return;
    }
    if (next.body) {
      document.getElementById("advice-body")?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) {
      return;
    }
    const range = parseContributionAgeRange(minAge, maxAge);
    const parsedBody = parseAdviceBody(body);
    const nextMin = range.ok ? null : (range.minimumIssue ?? null);
    const nextMax = range.ok ? null : (range.maximumIssue ?? null);
    const nextOrder = Boolean(!range.ok && range.order);
    const nextBody = parsedBody.ok ? null : parsedBody.issue;
    setMinError(nextMin);
    setMaxError(nextMax);
    setOrderError(nextOrder);
    setBodyError(nextBody);
    setSendError(null);
    if (nextMin || nextMax || nextOrder || nextBody) {
      focusFirstInvalid({
        min: nextMin,
        max: nextMax,
        order: nextOrder,
        body: nextBody,
      });
      return;
    }
    setBusy(true);
    const result = await submitCommunityAdvice({
      minAge: range.ok ? range.minimumAge : minAge,
      maxAge: range.ok ? range.maximumAge : maxAge,
      body: parsedBody.ok ? parsedBody.body : body,
    });
    setBusy(false);
    if (result.kind === "received") {
      onReceived();
      return;
    }
    if (result.kind === "invalid") {
      const serverMin = result.fields.minimumAge ?? null;
      const serverMax = result.fields.maximumAge ?? null;
      const serverOrder = Boolean(result.fields.order);
      const serverBody = result.fields.body ?? null;
      setMinError(serverMin);
      setMaxError(serverMax);
      setOrderError(serverOrder);
      setBodyError(serverBody);
      focusFirstInvalid({
        min: serverMin,
        max: serverMax,
        order: serverOrder,
        body: serverBody,
      });
      return;
    }
    if (result.kind === "rate-limited") {
      setSendError("rate-limited");
      return;
    }
    setSendError("unavailable");
  }

  const minDescribedBy = minError ? "from-age-error from-age-hint" : "from-age-hint";
  const maxDescribedBy = ["to-age-hint", maxError || orderError ? "to-age-error" : null]
    .filter(Boolean)
    .join(" ");
  const bodyDescribedBy = [
    "advice-body-hint",
    "advice-body-count",
    bodyError ? "advice-body-error" : null,
  ]
    .filter(Boolean)
    .join(" ");
  const maxFieldError = orderError
    ? AGE_ORDER_MESSAGE
    : maxError
      ? AGE_FIELD_MESSAGES[maxError]
      : undefined;

  return (
    <div id="offer-advice">
      <h1 className="type-title m-0">Offer advice</h1>
      <p className="type-body mt-[var(--space-5)] m-0">
        Write something you wish a person in this age range might hear. Keep it specific and
        human — not a slogan.
      </p>
      {sendError ? (
        <div className="mt-[var(--space-5)]">
          <InlineAlert
            tone="error"
            title={sendError === "rate-limited" ? SEND_RATE_LIMIT : SEND_ERROR}
          />
        </div>
      ) : null}
      <form className="mt-[var(--space-6)]" onSubmit={handleSubmit} noValidate>
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="type-ui m-0 p-0 text-ink">Who is this advice for?</legend>
          <p id="age-range-hint" className="type-meta mt-[var(--space-2)] m-0">
            You can widen this if the advice fits more than one age.
          </p>
          <div
            className="mt-[var(--space-4)] flex flex-col md:flex-row"
            style={{ gap: "var(--space-4)" }}
          >
            <Field
              className="min-w-0 flex-1"
              label="From age"
              htmlFor="from-age"
              hint="10–100"
              hintId="from-age-hint"
              error={minError ? AGE_FIELD_MESSAGES[minError] : undefined}
              errorId="from-age-error"
            >
              <TextField
                id="from-age"
                name="minAge"
                value={minAge}
                onChange={(event) => {
                  setMinAge(event.target.value);
                  if (minError) {
                    setMinError(null);
                  }
                  if (orderError && parseRequestedAge(event.target.value).ok) {
                    setOrderError(false);
                  }
                }}
                inputMode="numeric"
                autoComplete="off"
                placeholder="10–100"
                invalid={Boolean(minError)}
                aria-describedby={minDescribedBy}
              />
            </Field>
            <Field
              className="min-w-0 flex-1"
              label="To age"
              htmlFor="to-age"
              hint="10–100"
              hintId="to-age-hint"
              error={maxFieldError}
              errorId="to-age-error"
            >
              <TextField
                id="to-age"
                name="maxAge"
                value={maxAge}
                onChange={(event) => {
                  setMaxAge(event.target.value);
                  if (maxError) {
                    setMaxError(null);
                  }
                  if (orderError) {
                    setOrderError(false);
                  }
                }}
                inputMode="numeric"
                autoComplete="off"
                placeholder="10–100"
                invalid={Boolean(maxError || orderError)}
                aria-describedby={maxDescribedBy}
              />
            </Field>
          </div>
        </fieldset>
        <div className="mt-[var(--space-6)]">
          <Field
            label="Advice"
            htmlFor="advice-body"
            hint="A useful length is often about 40–400 characters. That is a writing guide, not a final product limit."
            hintId="advice-body-hint"
            error={bodyError ? ADVICE_BODY_MESSAGES[bodyError] : undefined}
            errorId="advice-body-error"
          >
            <TextArea
              id="advice-body"
              name="body"
              rows={6}
              value={body}
              maxLength={ADVICE_BODY_MAX_CHARS}
              onChange={(event) => {
                setBody(event.target.value);
                if (bodyError) {
                  setBodyError(null);
                }
              }}
              invalid={Boolean(bodyError)}
              aria-describedby={bodyDescribedBy}
            />
          </Field>
          <p id="advice-body-count" className="type-meta mt-[var(--space-2)] m-0">
            {body.length} / {ADVICE_BODY_MAX_CHARS} characters (provisional engineering
            maximum; U2 is unresolved)
          </p>
        </div>
        <ul
          className="type-body mt-[var(--space-6)] m-0 flex list-disc flex-col pl-[1.25rem]"
          style={{ gap: "var(--space-2)" }}
        >
          <li>Someone will review this before it can appear.</li>
          <li>Sending it does not mean it will be published.</li>
          <li>
            We may refuse advice that is harmful, spam, or against our{" "}
            <a href="#guidelines" className="type-ui text-ink underline">
              guidelines
            </a>
            .
          </li>
          <li>
            Do not include names, contact details, locations, or other personal information —
            yours or anyone else’s.
          </li>
        </ul>
        <div
          className="mt-[var(--space-7)] flex flex-col"
          style={{ gap: "var(--space-3)" }}
        >
          <Button variant="primary" type="submit" busy={busy} disabled={busy}>
            {busy ? "Loading…" : "Send for review"}
          </Button>
          <Button variant="secondary" type="button" onClick={onBack} disabled={busy}>
            {backLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
