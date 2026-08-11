import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy Policy — VerbRea" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-page max-w-3xl py-16 sm:py-24">
          <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-soft">Last updated August 2026</p>

          <div className="prose-content mt-10 space-y-6 text-[15px] leading-relaxed text-ink-soft">
            <p>
              VerbRea (&quot;we&quot;, &quot;us&quot;) provides a timed verbal reasoning assessment at this website.
              This policy explains what we collect and how we use it.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">Information we collect</h2>
            <p>
              Before starting the test, we collect your name, email address, and phone number.
              While you take the test, we record your answer choices and response times for each
              question. If you purchase a full report, this information is processed by our
              payment provider, Stripe, to complete the transaction.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">How we use it</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To score your test and generate your Verbal Reasoning Mastery report.</li>
              <li>To email your full report and receipt after purchase.</li>
              <li>To tell you about other VerbRea assessments that may be relevant to you.</li>
              <li>To process payment securely through Stripe.</li>
            </ul>
            <h2 className="font-display text-lg font-semibold text-ink">What we don&apos;t do</h2>
            <p>
              We do not sell your personal information to third parties. We do not store your
              card details — payment is handled entirely by Stripe.
            </p>
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <p>
              For any privacy questions or to request deletion of your data, reply to any email
              you&apos;ve received from us.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
