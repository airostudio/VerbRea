import { NextRequest, NextResponse } from "next/server";
import { getStripe, ORIGINAL_PRICE_USD_CENTS, PRICE_USD_CENTS } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/validation";
import { encodeAnswers } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/questions";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { lead, answers } = parsed.data;

  const knownIds = new Set(QUESTIONS.map((q) => q.id));
  if (!answers.some((a) => knownIds.has(a.questionId))) {
    return NextResponse.json({ error: "No valid answers submitted." }, { status: 400 });
  }

  const { indices, times } = encodeAnswers(answers);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: lead.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICE_USD_CENTS,
            product_data: {
              name: "Verbal Reasoning Mastery — Full Score Report",
              description: `One-time report unlock (regularly $${(ORIGINAL_PRICE_USD_CENTS / 100).toFixed(2)}, limited-time price)`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        name: lead.name.slice(0, 200),
        phone: lead.phone.slice(0, 40),
        email: lead.email.slice(0, 200),
        answers: indices,
        times: times,
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/results?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    return NextResponse.json(
      { error: "Payment setup is temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }
}
