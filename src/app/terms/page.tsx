import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Terms of Service — VerbRea" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-page max-w-3xl py-16 sm:py-24">
          <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
          <p className="mt-2 text-sm text-ink-soft">Last updated August 2026</p>

          <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-ink-soft">
            <p>
              By using VerbRea, you agree to the following terms. If you do not agree, please do
              not use this website.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">The assessment</h2>
            <p>
              VerbRea provides an original, timed verbal reasoning self-assessment for
              informational and self-development purposes. It is not affiliated with, endorsed
              by, or a substitute for any official examination such as the GRE, LSAT, or any
              third-party assessment provider referenced for context.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">Payment</h2>
            <p>
              The full Mastery Report is available for a one-time fee, shown at checkout, charged
              through Stripe. The charge is for report generation and delivery; because the
              report is generated and delivered digitally immediately after payment, purchases
              are final and non-refundable except where required by law.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">No guarantee</h2>
            <p>
              Your Mastery Score is a self-assessment tool. It does not guarantee performance on
              any official test, job assessment, or admissions process.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <p>Questions about these terms can be sent by replying to any email from us.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
