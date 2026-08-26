"use client";

import { useEffect, useRef, useState } from "react";
import { requestPublicAdvice } from "@/app/actions/advice";
import { AdviceExhausted } from "@/components/advice-exhausted";
import { AdviceReading } from "@/components/advice-reading";
import { AgeLanding } from "@/components/age-landing";
import { ContributionReceived } from "@/components/contribution-received";
import { OfferAdviceForm } from "@/components/offer-advice-form";
import type { PublicAdviceItem } from "@/lib/domain/public-advice";
import {
  rememberSeen,
  seenIdsForAge,
  type SeenByAge,
} from "@/lib/session/exclusion";

type LoopScreen =
  | { name: "age" }
  | {
      name: "reading";
      age: number;
      item: PublicAdviceItem | null;
      nextError: boolean;
      firstLoadError: boolean;
      reportThanks: boolean;
      rateLimited: boolean;
    }
  | { name: "exhausted"; age: number };

type Screen =
  | LoopScreen
  | { name: "contribute"; prefill: string; formKey: number; resume: LoopScreen }
  | { name: "received"; resume: LoopScreen };

const AGE_TITLE = "Age · Life advice";
const OFFER_TITLE = "Offer advice · Life advice";
const RECEIVED_TITLE = "Received · Life advice";

function adviceTitle(age: number) {
  return `Advice for age ${age} · Life advice`;
}

function isLoopScreen(screen: Screen): screen is LoopScreen {
  return screen.name === "age" || screen.name === "reading" || screen.name === "exhausted";
}

function prefillFrom(screen: Screen, sessionAge: string): string {
  if (screen.name === "reading" || screen.name === "exhausted") {
    return String(screen.age);
  }
  if (screen.name === "contribute" || screen.name === "received") {
    const resume = screen.resume;
    if (resume.name === "reading" || resume.name === "exhausted") {
      return String(resume.age);
    }
  }
  return sessionAge;
}

function resumeFrom(screen: Screen): LoopScreen {
  if (isLoopScreen(screen)) {
    return screen;
  }
  return screen.resume;
}

export function AdviceExperience() {
  const [screen, setScreen] = useState<Screen>({ name: "age" });
  const [loading, setLoading] = useState(false);
  const [seenByAge, setSeenByAge] = useState<SeenByAge>({});
  const [prefillAge, setPrefillAge] = useState("");
  const requestSeq = useRef(0);
  const formKeyRef = useRef(0);

  useEffect(() => {
    if (screen.name === "age") {
      document.title = AGE_TITLE;
      return;
    }
    if (screen.name === "contribute") {
      document.title = OFFER_TITLE;
      return;
    }
    if (screen.name === "received") {
      document.title = RECEIVED_TITLE;
      return;
    }
    document.title = adviceTitle(screen.age);
  }, [screen]);

  useEffect(() => {
    function openFromHash() {
      if (window.location.hash !== "#offer-advice") {
        return;
      }
      requestSeq.current += 1;
      setLoading(false);
      setScreen((current) => {
        if (current.name === "contribute") {
          return current;
        }
        formKeyRef.current += 1;
        return {
          name: "contribute",
          prefill: prefillFrom(current, prefillAge),
          formKey: formKeyRef.current,
          resume: resumeFrom(current),
        };
      });
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [prefillAge]);

  function goToAge() {
    requestSeq.current += 1;
    setLoading(false);
    setScreen({ name: "age" });
  }

  function restoreLoop(resume: LoopScreen) {
    requestSeq.current += 1;
    setLoading(false);
    setScreen(resume);
  }

  function openContribute(empty: boolean) {
    requestSeq.current += 1;
    setLoading(false);
    setScreen((current) => {
      formKeyRef.current += 1;
      const prefill = empty ? "" : prefillFrom(current, prefillAge);
      return {
        name: "contribute",
        prefill,
        formKey: formKeyRef.current,
        resume: resumeFrom(current),
      };
    });
  }

  async function requestAdvice(
    age: number,
    mode: "first" | "next",
    seen: SeenByAge = seenByAge,
  ) {
    const seq = ++requestSeq.current;
    setLoading(true);
    if (mode === "first") {
      setScreen({
        name: "reading",
        age,
        item: null,
        nextError: false,
        firstLoadError: false,
        reportThanks: false,
        rateLimited: false,
      });
    } else {
      setScreen((current) =>
        current.name === "reading"
          ? { ...current, nextError: false, rateLimited: false }
          : current,
      );
    }
    const result = await requestPublicAdvice(age, seenIdsForAge(seen, age));
    if (seq !== requestSeq.current) {
      return;
    }
    setLoading(false);
    if (result.kind === "item") {
      setSeenByAge((current) => rememberSeen(current, result.age, result.item.id));
      setScreen({
        name: "reading",
        age: result.age,
        item: result.item,
        nextError: false,
        firstLoadError: false,
        reportThanks: false,
        rateLimited: false,
      });
      return;
    }
    if (result.kind === "exhausted") {
      setScreen({ name: "exhausted", age: result.age });
      return;
    }
    if (result.kind === "rate-limited") {
      if (mode === "next") {
        setScreen((current) =>
          current.name === "reading"
            ? { ...current, nextError: false, rateLimited: true }
            : {
                name: "reading",
                age,
                item: null,
                nextError: false,
                firstLoadError: true,
                reportThanks: false,
                rateLimited: true,
              },
        );
        return;
      }
      setScreen({
        name: "reading",
        age,
        item: null,
        nextError: false,
        firstLoadError: true,
        reportThanks: false,
        rateLimited: true,
      });
      return;
    }
    if (mode === "next") {
      setScreen((current) =>
        current.name === "reading"
          ? { ...current, nextError: true, rateLimited: false }
          : {
              name: "reading",
              age,
              item: null,
              nextError: false,
              firstLoadError: true,
              reportThanks: false,
              rateLimited: false,
            },
      );
      return;
    }
    setScreen({
      name: "reading",
      age,
      item: null,
      nextError: false,
      firstLoadError: true,
      reportThanks: false,
      rateLimited: false,
    });
  }

  function handleValidAge(age: number) {
    setPrefillAge(String(age));
    void requestAdvice(age, "first");
  }

  if (screen.name === "age") {
    return (
      <AgeLanding
        initialAge={prefillAge}
        busy={loading}
        onValidSubmit={handleValidAge}
      />
    );
  }
  if (screen.name === "contribute") {
    const restoreAdvice =
      screen.resume.name === "reading" || screen.resume.name === "exhausted";
    const canReturnToAdvice = restoreAdvice || prefillAge !== "";
    return (
      <OfferAdviceForm
        key={screen.formKey}
        initialMinAge={screen.prefill}
        initialMaxAge={screen.prefill}
        backLabel={canReturnToAdvice ? "Back to advice" : "Back"}
        onBack={() => restoreLoop(screen.resume)}
        onReceived={() => setScreen({ name: "received", resume: screen.resume })}
      />
    );
  }
  if (screen.name === "received") {
    const restoreAdvice =
      screen.resume.name === "reading" || screen.resume.name === "exhausted";
    return (
      <ContributionReceived
        primaryLabel={restoreAdvice ? "Back to advice" : "See advice"}
        onPrimary={() => (restoreAdvice ? restoreLoop(screen.resume) : goToAge())}
        onOfferAnother={() => openContribute(true)}
      />
    );
  }
  if (screen.name === "exhausted") {
    return (
      <AdviceExhausted
        age={screen.age}
        onChangeAge={goToAge}
        onOfferAdvice={() => openContribute(false)}
      />
    );
  }
  return (
    <AdviceReading
      age={screen.age}
      itemId={screen.item?.id ?? null}
      body={screen.item?.body ?? null}
      loading={loading}
      nextError={screen.nextError}
      firstLoadError={screen.firstLoadError}
      reportThanks={screen.reportThanks}
      rateLimited={screen.rateLimited}
      onNext={() => {
        if (loading) {
          return;
        }
        void requestAdvice(screen.age, "next");
      }}
      onRetry={() => {
        if (loading) {
          return;
        }
        void requestAdvice(screen.age, "first");
      }}
      onChangeAge={goToAge}
      onOfferAdvice={() => openContribute(false)}
      onReported={(id) => {
        const nextSeen = rememberSeen(seenByAge, screen.age, id);
        setSeenByAge(nextSeen);
        setScreen({
          name: "reading",
          age: screen.age,
          item: null,
          nextError: false,
          firstLoadError: false,
          reportThanks: true,
          rateLimited: false,
        });
        void requestAdvice(screen.age, "next", nextSeen);
      }}
    />
  );
}
