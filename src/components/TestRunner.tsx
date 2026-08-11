"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, CATEGORY_LABELS } from "@/lib/questions";
import { loadLead, saveAnswers } from "@/lib/clientStorage";
import type { AnswerRecord } from "@/lib/types";
import { QuestionTimer } from "./QuestionTimer";
import { Button } from "./Button";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function TestRunner() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(QUESTIONS[0].timeLimitSec);
  const answersRef = useRef<AnswerRecord[]>([]);
  const selectedRef = useRef<number | null>(null);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    // Lead data lives in sessionStorage (client-only), so gating readiness
    // must happen post-mount rather than during the initial render.
    const lead = loadLead();
    if (!lead) {
      router.replace("/start");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [router]);

  const question = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;

  const advance = useCallback(
    (selectedIndex: number, timeUsedSec: number) => {
      answersRef.current = [
        ...answersRef.current,
        { questionId: question.id, selectedIndex, timeUsedSec },
      ];

      if (isLast) {
        saveAnswers(answersRef.current);
        const lead = loadLead();
        if (lead) {
          // Fire-and-forget — the teaser email shouldn't block navigation to results.
          fetch("/api/teaser-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead, answers: answersRef.current }),
          }).catch(() => {});
        }
        router.push("/results");
        return;
      }

      setIndex((i) => i + 1);
      setSelected(null);
    },
    [question.id, isLast, router]
  );

  // Countdown timer — resets on every question change.
  useEffect(() => {
    if (!ready) return;
    // Resets the on-screen countdown for the new question before the
    // interval below starts ticking it down.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(question.timeLimitSec);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const left = Math.max(0, question.timeLimitSec - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        advance(selectedRef.current ?? -1, question.timeLimitSec);
      }
    }, 250);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, index]);

  function handleNext() {
    if (selected === null) return;
    const timeUsed = question.timeLimitSec - remaining;
    advance(selected, timeUsed);
  }

  const progressPct = useMemo(
    () => Math.round((index / QUESTIONS.length) * 100),
    [index]
  );

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-ink-soft">Loading your test…</p>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-ink-soft">
          <span>
            Question {index + 1} of {QUESTIONS.length}
          </span>
          <span className="font-medium uppercase tracking-wide text-gold-ink">
            {CATEGORY_LABELS[question.category]}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-navy-deep transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
          {CATEGORY_LABELS[question.category]}
        </h1>
        <QuestionTimer remainingSec={remaining} totalSec={question.timeLimitSec} />
      </div>

      {question.stimulus && (
        <div className="mb-6 rounded-2xl border border-line bg-paper-soft p-6 text-[15px] leading-relaxed text-ink-soft">
          {question.stimulus}
        </div>
      )}

      <p className="mb-6 text-lg font-medium leading-relaxed text-ink sm:text-xl">
        {question.prompt}
      </p>

      <div className="space-y-3" role="radiogroup" aria-label="Answer options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(i)}
              className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left text-[15px] leading-relaxed transition-colors ${
                isSelected
                  ? "border-navy-deep bg-navy-deep text-on-navy"
                  : "border-line bg-white text-ink hover:border-gold-ink/60 hover:bg-paper-soft"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  isSelected
                    ? "border-gold bg-gold text-navy-deep"
                    : "border-line text-ink-soft"
                }`}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="pt-0.5">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-ink-soft">Selecting an answer does not lock it in until you continue.</p>
        <Button variant="primary" onClick={handleNext} disabled={selected === null}>
          {isLast ? "Finish test →" : "Next question →"}
        </Button>
      </div>
    </div>
  );
}
