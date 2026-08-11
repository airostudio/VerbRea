import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { computeScoreReport, decodeAnswers } from "@/lib/scoring";

/**
 * Verifies a completed Stripe Checkout session server-side and returns the
 * decoded lead + report. This is what actually unlocks the full results view
 * after payment — a session_id in the URL alone proves nothing on its own.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const sessionId = (body as { sessionId?: unknown })?.sessionId;
  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
    }

    const meta = session.metadata;
    if (!meta?.answers || !meta?.times || !meta?.email) {
      return NextResponse.json({ error: "Session is missing result data." }, { status: 422 });
    }

    const answers = decodeAnswers(meta.answers, meta.times);
    const report = computeScoreReport(answers);

    return NextResponse.json({
      paid: true,
      lead: { name: meta.name ?? "", email: meta.email, phone: meta.phone ?? "" },
      answers,
      report,
    });
  } catch (err) {
    console.error("Failed to verify checkout session", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }
}
