"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { StepperButton } from "@/components/ui/stepper-button";
import { TextField } from "@/components/ui/text-field";
import { SITE_LINE } from "@/lib/site";

const MIN_AGE = 10;
const MAX_AGE = 100;

type AgeIssue = "empty" | "range" | "integer";

const AGE_MESSAGES: Record<AgeIssue, string> = {
  empty: "Enter an age from 10 to 100.",
  range: "Use an age from 10 to 100.",
  integer: "Use a whole number from 10 to 100.",
};

function parseAgeDigits(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }
  return Number.parseInt(trimmed, 10);
}

function issueFor(raw: string): AgeIssue | null {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return "empty";
  }
  const n = parseAgeDigits(trimmed);
  if (n === null) {
    return "integer";
  }
  if (n < MIN_AGE || n > MAX_AGE) {
    return "range";
  }
  return null;
}

function normaliseDigits(raw: string): string {
  const n = parseAgeDigits(raw);
  if (n === null) {
    return raw.trim();
  }
  return String(n);
}

type AgeLandingProps = {
  initialAge?: string;
  busy?: boolean;
  onValidSubmit: (age: number) => void;
};

export function AgeLanding({
  initialAge = "",
  busy = false,
  onValidSubmit,
}: AgeLandingProps) {
  const [age, setAge] = useState(initialAge);
  const [error, setError] = useState<AgeIssue | null>(null);
  const parsed = parseAgeDigits(age);
  const decreaseDisabled = parsed === null || parsed <= MIN_AGE;
  const increaseDisabled = parsed !== null && parsed >= MAX_AGE;

  function showIssue(issue: AgeIssue) {
    setError(issue);
    document.getElementById("age")?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = issueFor(age);
    if (issue) {
      showIssue(issue);
      return;
    }
    setError(null);
    const submitted = parseAgeDigits(age);
    if (submitted === null) {
      showIssue("integer");
      return;
    }
    onValidSubmit(submitted);
  }

  function handleBlur() {
    if (age.trim() === "") {
      return;
    }
    const normalised = normaliseDigits(age);
    if (normalised !== age) {
      setAge(normalised);
    }
    const issue = issueFor(normalised);
    if (issue && issue !== "empty") {
      setError(issue);
    } else {
      setError(null);
    }
  }

  function handleDecrease() {
    if (parsed === null || parsed <= MIN_AGE) {
      return;
    }
    const next = String(parsed - 1);
    setAge(next);
    setError(issueFor(next));
  }

  function handleIncrease() {
    if (parsed === null) {
      setAge(String(MIN_AGE));
      setError(null);
      return;
    }
    if (parsed >= MAX_AGE) {
      return;
    }
    const next = String(Math.min(MAX_AGE, parsed + 1));
    setAge(next);
    setError(issueFor(next));
  }

  const errorId = "age-error";
  const hintId = "age-hint";
  const describedBy = error ? `${hintId} ${errorId}` : hintId;

  return (
    <>
      <h1 className="type-title m-0">Advice for the age you are.</h1>
      <p className="type-body mt-[var(--space-5)] m-0">{SITE_LINE}</p>
      <p className="type-body mt-[var(--space-4)] m-0">
        Enter an age from 10 to 100. We’ll show one piece of advice for that time of
        life. You don’t need an account.
      </p>
      <p className="type-body mt-[var(--space-4)] m-0">
        Age helps us choose something relevant. We don’t use it to identify you.
      </p>
      <form className="mt-[var(--space-6)]" onSubmit={handleSubmit} noValidate>
        <Field
          label="Age"
          htmlFor="age"
          labelId="age-label"
          hint="10–100"
          hintId={hintId}
          error={error ? AGE_MESSAGES[error] : undefined}
          errorId={errorId}
        >
          <div
            className="flex flex-wrap items-center"
            style={{ gap: "var(--space-2)" }}
            role="group"
            aria-labelledby="age-label"
          >
            <div className="min-w-[10rem] flex-1">
              <TextField
                id="age"
                name="age"
                value={age}
                onChange={(event) => {
                  setAge(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                onBlur={handleBlur}
                inputMode="numeric"
                autoComplete="off"
                placeholder="10–100"
                invalid={Boolean(error)}
                aria-describedby={describedBy}
              />
            </div>
            <StepperButton
              label="Decrease age"
              symbol="−"
              disabled={decreaseDisabled}
              aria-disabled={decreaseDisabled}
              onClick={handleDecrease}
            />
            <StepperButton
              label="Increase age"
              symbol="+"
              disabled={increaseDisabled}
              aria-disabled={increaseDisabled}
              onClick={handleIncrease}
            />
          </div>
        </Field>
        <div className="mt-[var(--space-6)]">
          <Button variant="primary" type="submit" busy={busy} disabled={busy}>
            {busy ? "Loading…" : "See advice"}
          </Button>
        </div>
      </form>
    </>
  );
}
