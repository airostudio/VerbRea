import { NextRequest, NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/validation";
import { computeScoreReport, encodeAnswers } from "@/lib/scoring";
import { buildResultsQuery, sendTeaserEmail } from "@/lib/email";
import { QUESTIONS } from "@/lib/questions";

/** Fires right when the user finishes the test — emails the blurred, pre-payment teaser. */
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

  try {
    const report = computeScoreReport(answers);
    const { indices, times } = encodeAnswers(answers);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
    const resultsUrl = `${siteUrl}/results?${buildResultsQuery(lead, indices, times)}`;

    await sendTeaserEmail({ lead, report, resultsUrl, siteUrl });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send teaser email", err);
    // Non-fatal from the client's point of view — the on-site results page still works.
    return NextResponse.json({ error: "Could not send email." }, { status: 502 });
  }
}
