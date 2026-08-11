import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export const metadata: Metadata = {
  title: "Start your Verbal Reasoning Mastery test — VerbRea",
};

export default function StartPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper-soft">
        <div className="container-page grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-ink">
              Before you begin
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Tell us where to send your results.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              You&apos;ll take {TOTAL_QUESTIONS} timed questions across four reasoning formats. Your
              full Mastery Score, percentile, and explanations are unlocked afterward for a
              one-time $1.99 and emailed to the address below.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-ink" />
                Each question has its own countdown — work quickly and decisively.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-ink" />
                You can move forward but not skip ahead — this mirrors real timed assessments.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-ink" />
                Takes about 20 minutes. Use a quiet space and treat it as a real assessment.
              </li>
            </ul>
            <div className="relative mt-10 hidden h-40 w-full overflow-hidden rounded-2xl sm:block">
              <Image
                src="/images/emblem-deductive.webp"
                alt=""
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-8 shadow-[0_1px_2px_rgba(16,22,31,0.04)] sm:p-10">
            <LeadForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
