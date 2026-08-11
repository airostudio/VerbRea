import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ButtonLink } from "@/components/Button";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, TOTAL_QUESTIONS } from "@/lib/questions";
import type { QuestionCategory } from "@/lib/types";

const CATEGORY_IMAGES: Record<QuestionCategory, string> = {
  deductive: "/images/emblem-deductive.webp",
  critical: "/images/emblem-critical.webp",
  reading: "/images/emblem-reading.webp",
  precision: "/images/emblem-precision.webp",
};

const CATEGORY_ORDER: QuestionCategory[] = ["deductive", "critical", "reading", "precision"];

const STEPS = [
  {
    title: "Answer 24 calibrated items",
    body: "Four question formats — deductive reasoning, critical reasoning, reading comprehension, and verbal precision — each on its own countdown.",
  },
  {
    title: "We score speed and accuracy",
    body: "Your Verbal Reasoning Mastery Score blends correctness with response time, the same dual signal used in executive assessment suites.",
  },
  {
    title: "Unlock your full report",
    body: "For a one-time $1.99, get your full score, percentile, category breakdown, and a question-by-question explanation, emailed to you.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy-deep text-on-navy">
          <Image
            src="/images/hero-network.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none select-none object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20" />
          <div className="container-page relative py-28 sm:py-36">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft">
              GRE Verbal &middot; LSAT Logical Reasoning &middot; Executive Assessment Standard
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-on-navy sm:text-6xl">
              How fast does your brain reason with language?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-navy-soft">
              VerbRea measures cognitive efficiency, not vocabulary trivia — how rapidly and
              accurately you process arguments, apply deductive logic, and extract the
              conclusion that must be true. Built to the format and rigor of graduate and
              professional aptitude testing.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/start" variant="primary">
                Start the Verbal Reasoning Mastery test →
              </ButtonLink>
              <p className="text-sm text-on-navy-soft">
                {TOTAL_QUESTIONS} questions &middot; ~20 minutes &middot; full report $1.99
              </p>
            </div>
          </div>
        </section>

        {/* What we measure */}
        <section id="what-we-measure" className="container-page py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-ink">
              What we measure
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Four cognitive-efficiency dimensions, not word lists.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Every item is built around top-down logic and argument evaluation — the same
              constructs assessed by GRE Verbal, LSAT Logical Reasoning, and firms like SHL and
              Korn Ferry — rather than simple definition recall.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_ORDER.map((cat) => (
              <div
                key={cat}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,22,31,0.04)] transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(16,22,31,0.18)]"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={CATEGORY_IMAGES[cat]}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-paper-soft py-24">
          <div className="container-page">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-ink">
              How it works
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-ink sm:text-4xl">
              Three steps to your Mastery Score.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-deep font-display text-lg font-semibold text-gold">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative overflow-hidden bg-navy-deep py-24 text-on-navy">
          <Image
            src="/images/texture-dots.webp"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none select-none object-cover opacity-[0.06]"
          />
          <div className="container-page relative flex flex-col items-center text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-soft">
              Limited-time introductory pricing
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-2xl text-on-navy-soft line-through decoration-2">
                $9.99
              </span>
              <span className="font-display text-6xl font-semibold text-gold">$1.99</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-on-navy-soft">
              One-time payment for your full Verbal Reasoning Mastery report — score, percentile,
              category breakdown, and every explanation, delivered to your inbox.
            </p>
            <ButtonLink href="/start" variant="primary" className="mt-8">
              Start the test →
            </ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
