import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ButtonLink } from "@/components/Button";
import { getStripe } from "@/lib/stripe";
import { ClearSessionOnMount } from "@/components/ClearSessionOnMount";

export const metadata: Metadata = {
  title: "You're all set — VerbRea",
  robots: { index: false },
};

async function getSessionDetails(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    return {
      name: session.metadata?.name ?? "",
      email: session.customer_email ?? session.metadata?.email ?? "",
    };
  } catch (err) {
    console.error("Failed to retrieve checkout session", err);
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const details = await getSessionDetails(session_id);
  const firstName = details?.name?.split(" ")[0];

  return (
    <>
      <Header />
      <ClearSessionOnMount />
      <main className="flex-1 bg-navy-deep text-on-navy">
        <div className="container-page flex flex-col items-center py-24 text-center sm:py-32">
          <Image
            src="/images/seal-badge.webp"
            alt=""
            width={96}
            height={96}
            className="rounded-full"
          />
          <h1 className="mt-8 max-w-xl font-display text-3xl font-semibold text-on-navy sm:text-4xl">
            {details ? `You're all set, ${firstName}.` : "Payment received."}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-on-navy-soft">
            {details
              ? `Your full Verbal Reasoning Mastery report is on its way to ${details.email}. It usually arrives within a few minutes.`
              : "Your full Verbal Reasoning Mastery report is on its way to your inbox. It usually arrives within a few minutes."}
          </p>
          <p className="mt-2 max-w-md text-sm text-on-navy-soft">
            Don&apos;t see it soon? Check spam, or the address you entered before starting the test.
          </p>
          <ButtonLink href="/" variant="primary" className="mt-9">
            Back to VerbRea
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
