"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { clearSession, loadAnswers, loadLead, saveAnswers, saveLead } from "@/lib/clientStorage";
import { computeScoreReport, decodeAnswers } from "@/lib/scoring";
import type { ScoreReport, AnswerRecord, LeadInfo } from "@/lib/types";
import { OFFERS } from "@/lib/offers";
import { Button } from "./Button";

interface Session {
  lead: LeadInfo;
  answers: AnswerRecord[];
  report: ScoreReport;
  unlocked: boolean;
}

export function ResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<Session | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      // Paid redirect from Stripe — verify server-side rather than trusting the URL.
      if (sessionId) {
        try {
          const res = await fetch("/api/verify-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (!res.ok || !data.paid) {
            throw new Error(data.error ?? "Payment could not be verified.");
          }
          if (cancelled) return;
          clearSession();
          setSession({
            lead: data.lead,
            answers: data.answers,
            report: data.report,
            unlocked: true,
          });
        } catch (err) {
          if (!cancelled) {
            setVerifyError(
              err instanceof Error ? err.message : "Payment could not be verified."
            );
          }
        }
        return;
      }

      // Same-tab, just-finished-the-test path.
      const storedLead = loadLead();
      const storedAnswers = loadAnswers();
      if (storedLead && storedAnswers) {
        if (!cancelled) {
          setSession({
            lead: storedLead,
            answers: storedAnswers,
            report: computeScoreReport(storedAnswers),
            unlocked: false,
          });
        }
        return;
      }

      // Emailed link opened on a different device/browser — self-contained in the URL.
      const a = searchParams.get("a");
      const t = searchParams.get("t");
      const email = searchParams.get("email");
      if (a && t && email) {
        const lead: LeadInfo = {
          name: searchParams.get("name") ?? "",
          email,
          phone: searchParams.get("phone") ?? "",
        };
        const answers = decodeAnswers(a, t);
        saveLead(lead);
        saveAnswers(answers);
        if (!cancelled) {
          setSession({ lead, answers, report: computeScoreReport(answers), unlocked: false });
        }
        return;
      }

      router.replace("/start");
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const report = session?.report ?? null;
  const lead = session?.lead ?? null;
  const answers = session?.answers ?? null;
  const unlocked = session?.unlocked ?? false;

  const scoreOutOf = 800;
  const scoreFillPct = useMemo(
    () => (report ? Math.round(((report.mastersScore - 400) / (scoreOutOf - 400)) * 100) : 0),
    [report]
  );

  async function handleUnlock() {
    if (!lead || !answers) return;
    setSubmitting(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, answers }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong starting checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  if (verifyError) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          We couldn&apos;t verify your payment
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft">{verifyError}</p>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          If you were charged, your results were also emailed to you. Otherwise, please try
          unlocking again.
        </p>
      </div>
    );
  }

  if (!report || !lead) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-ink-soft">Scoring your test…</p>
      </div>
    );
  }

  return (
    <div className="container-page py-14 sm:py-20">
      {canceled && !unlocked && (
        <div className="mb-8 rounded-xl border border-gold-ink/30 bg-paper-soft px-5 py-3 text-sm text-ink-soft">
          Checkout was canceled — your results are still saved. Unlock whenever you&apos;re ready.
        </div>
      )}

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-ink">
          {lead.name.split(" ")[0]}&apos;s results
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Your Verbal Reasoning Mastery Score
        </h1>
      </div>

      <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-3xl bg-navy-deep text-on-navy">
        <div className="relative flex flex-col items-center px-8 py-12">
          <Image
            src="/images/hero-network.webp"
            alt=""
            fill
            sizes="640px"
            className="pointer-events-none select-none object-cover opacity-25"
          />
          <div className="relative">
            <div className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-on-navy-soft">
              Mastery Score
            </div>
            <div className="mt-2 font-display text-7xl font-semibold text-gold">
              {report.mastersScore}
            </div>
            <div className="mt-1 text-center text-sm text-on-navy-soft">out of 800</div>
            <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold" style={{ width: `${scoreFillPct}%` }} />
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-base font-semibold text-gold-soft">
              {report.tier}
              <span className="text-on-navy-soft">&middot; {report.percentile}th percentile</span>
            </div>
          </div>
        </div>
      </div>

      {unlocked && (
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-emerald-ink/30 bg-paper-soft px-5 py-3 text-center text-sm text-emerald-ink">
          ✓ Full report unlocked — also emailed to {lead.email}
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {report.categories.map((c) => (
          <div
            key={c.category}
            className="relative overflow-hidden rounded-2xl border border-line bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">{c.label}</h3>
              <span className="text-sm font-semibold text-gold-ink">{c.accuracyPct}%</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-navy-deep"
                style={{ width: `${c.accuracyPct}%` }}
              />
            </div>
            {unlocked ? (
              <p className="mt-4 text-xs text-ink-soft">
                {c.correct}/{c.total} correct &middot; Avg response time {c.avgTimeSec}s
              </p>
            ) : (
              <>
                <div className="mt-4 select-none blur-sm" aria-hidden="true">
                  <p className="text-xs text-ink-soft">
                    Avg response time · {c.avgTimeSec}s · Percentile rank · Strength notes
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-14 items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-2 text-xs font-semibold text-ink-soft">
                  Unlock to view detail
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {!unlocked && (
        <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-line bg-paper-soft p-8 text-center sm:p-12">
          <Image
            src="/images/seal-badge.webp"
            alt=""
            width={72}
            height={72}
            className="mx-auto rounded-full"
          />
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
            Unlock your full Mastery Report
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            Get your complete category breakdown, response-time analysis, percentile detail, and
            a full explanation for every question — emailed to {lead.email}.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="font-display text-xl text-ink-soft line-through">$9.99</span>
            <span className="font-display text-4xl font-semibold text-ink">$1.99</span>
            <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-ink">
              Today only
            </span>
          </div>
          {checkoutError && <p className="mt-4 text-sm text-danger">{checkoutError}</p>}
          <Button
            variant="primary"
            className="mt-7 w-full sm:w-auto"
            onClick={handleUnlock}
            disabled={submitting}
          >
            {submitting ? "Redirecting to secure checkout…" : "Unlock full report — $1.99 →"}
          </Button>
          <p className="mt-4 text-xs text-ink-soft">
            Secure payment via Stripe. One-time charge, no subscription.
          </p>
        </div>
      )}

      <div className="mx-auto mt-16 max-w-3xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-gold-ink">
          Also available after purchase
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OFFERS.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line bg-white p-5">
              <h4 className="font-display text-sm font-semibold text-ink">{o.name}</h4>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{o.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
