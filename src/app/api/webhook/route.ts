import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { computeScoreReport, decodeAnswers } from "@/lib/scoring";
import { sendResultsEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata;

    if (!meta?.answers || !meta?.times || !meta?.email) {
      console.error("Checkout session completed without expected metadata", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const answers = decodeAnswers(meta.answers, meta.times);
      const report = computeScoreReport(answers);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

      await sendResultsEmail({
        lead: { name: meta.name ?? "", email: meta.email, phone: meta.phone ?? "" },
        report,
        answers,
        siteUrl,
      });
    } catch (err) {
      console.error("Failed to process completed checkout / send results email", err);
      // Return 500 so Stripe retries delivery of this webhook event.
      return NextResponse.json({ error: "Processing failed." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
