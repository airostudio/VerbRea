import { Resend } from "resend";
import { CATEGORY_LABELS, QUESTIONS } from "./questions";
import { OFFERS } from "./offers";
import type { AnswerRecord, LeadInfo, ScoreReport } from "./types";

let resendClient: Resend | null = null;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it in your Vercel project's Environment Variables."
    );
  }
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

const NAVY = "#0b1526";
const NAVY_DEEP = "#070c14";
const GOLD = "#c9a24b";
const GOLD_DARK = "#8a641a";
const EMERALD = "#157a56";
const INK = "#10161f";
const INK_SOFT = "#4b5565";
const LINE = "#e3e6ec";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreBlock(report: ScoreReport): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border-radius:10px;">
      <tr>
        <td align="center" style="padding:28px 20px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#b9c2d0;">Verbal Reasoning Mastery Score</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:52px;color:${GOLD};font-weight:700;line-height:1.1;margin-top:6px;">${report.mastersScore}</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#f0d9a8;margin-top:4px;">${escapeHtml(report.tier)} &middot; ${report.percentile}th percentile</div>
        </td>
      </tr>
    </table>`;
}

function categoryRows(report: ScoreReport): string {
  return report.categories
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${INK};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(c.label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${INK_SOFT};font-family:Arial,Helvetica,sans-serif;text-align:right;">${c.correct}/${c.total} correct</td>
        <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${GOLD_DARK};font-family:Arial,Helvetica,sans-serif;text-align:right;font-weight:700;">${c.accuracyPct}%</td>
      </tr>`
    )
    .join("");
}

/** Category rows with the accuracy/detail columns locked behind a paywall notice. */
function blurredCategoryRows(report: ScoreReport): string {
  return report.categories
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;color:${INK};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(c.label)}</td>
        <td colspan="2" style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:13px;color:#9aa3b2;font-family:Arial,Helvetica,sans-serif;text-align:right;">&#128274; Unlock to view</td>
      </tr>`
    )
    .join("");
}

function questionReview(answers: AnswerRecord[]): string {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  return QUESTIONS.map((q, i) => {
    const a = byId.get(q.id);
    const selected = a?.selectedIndex ?? -1;
    const correct = selected === q.correctIndex;
    const yourAnswer = selected >= 0 ? q.options[selected] : "No answer (time expired)";
    const correctAnswer = q.options[q.correctIndex];
    const badgeColor = correct ? EMERALD : "#c23a3a";
    const badgeText = correct ? "Correct" : "Missed";
    return `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid ${LINE};">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${INK_SOFT};margin-bottom:4px;">
          Q${i + 1} &middot; ${escapeHtml(CATEGORY_LABELS[q.category])} &middot;
          <span style="color:${badgeColor};font-weight:700;">${badgeText}</span>
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${INK};margin-bottom:6px;">${escapeHtml(q.prompt)}</div>
        ${
          !correct
            ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#c23a3a;margin-bottom:2px;">Your answer: ${escapeHtml(yourAnswer)}</div>`
            : ""
        }
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${EMERALD};margin-bottom:6px;">Correct answer: ${escapeHtml(correctAnswer)}</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${INK_SOFT};">${escapeHtml(q.explanation)}</div>
      </td>
    </tr>`;
  }).join("");
}

function offerCards(): string {
  return OFFERS.map(
    (o) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${LINE};">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${NAVY};font-weight:700;">${escapeHtml(o.name)}</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${INK_SOFT};margin-top:2px;">${escapeHtml(o.tagline)}</div>
      </td>
    </tr>`
  ).join("");
}

function emailShell(headerLabel: string, bodyRows: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f2f3f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f3f6;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92vw;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${NAVY_DEEP};padding:36px 40px;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${GOLD};font-weight:700;letter-spacing:0.02em;">VerbRea</div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#b9c2d0;margin-top:4px;">${escapeHtml(headerLabel)}</div>
              </td>
            </tr>
            ${bodyRows}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sent immediately after the test finishes — score visible, details locked behind the paywall. */
export function buildTeaserEmailHtml(
  lead: LeadInfo,
  report: ScoreReport,
  resultsUrl: string,
  siteUrl: string
): string {
  const firstName = lead.name.trim().split(/\s+/)[0] || "there";
  const rows = `
    <tr>
      <td style="padding:32px 40px 8px 40px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${INK};line-height:1.6;margin:0 0 20px 0;">
          Hi ${escapeHtml(firstName)}, you've finished your Verbal Reasoning Mastery test. Here's your headline score — your full category breakdown and question-by-question explanations are ready to unlock.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px;">${scoreBlock(report)}</td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${NAVY};font-weight:700;margin-bottom:8px;">Category breakdown</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${blurredCategoryRows(report)}
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:32px 40px;">
        <div style="margin-bottom:6px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${INK_SOFT};">
          <span style="text-decoration:line-through;color:#9aa3b2;">$9.99</span>
          &nbsp;<strong style="color:${INK};font-size:16px;">$1.99</strong> for the full report today
        </div>
        <a href="${resultsUrl}" style="display:inline-block;margin-top:10px;background:${GOLD};color:${NAVY_DEEP};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:999px;">Unlock my full report &rarr;</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px 32px 40px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9aa3b2;line-height:1.6;margin:0;">
          You're receiving this email because you completed a Verbal Reasoning Mastery test at ${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}. Reply to this email with any questions.
        </p>
      </td>
    </tr>`;
  return emailShell("Your results are ready", rows);
}

/** Sent after payment — full open results, plus a link back to the live, unlocked results page. */
export function buildResultsEmailHtml(
  lead: LeadInfo,
  report: ScoreReport,
  answers: AnswerRecord[],
  resultsUrl: string,
  siteUrl: string
): string {
  const firstName = lead.name.trim().split(/\s+/)[0] || "there";
  const rows = `
    <tr>
      <td style="padding:32px 40px 8px 40px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${INK};line-height:1.6;margin:0 0 20px 0;">
          Hi ${escapeHtml(firstName)}, your full Verbal Reasoning Mastery report is ready. Here is your complete score breakdown, question-by-question review, and explanations.
        </p>
        <a href="${resultsUrl}" style="display:inline-block;background:${NAVY};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">View my results online &rarr;</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px;">${scoreBlock(report)}</td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${INK_SOFT};line-height:1.6;margin:0;">${escapeHtml(report.tierDescription)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${NAVY};font-weight:700;margin-bottom:8px;">Category breakdown</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${categoryRows(report)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 40px 0 40px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${NAVY};font-weight:700;margin-bottom:4px;">Full question review</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${questionReview(answers)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px;background:#f7f8fb;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${NAVY};font-weight:700;margin-bottom:10px;">Continue building your profile</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${offerCards()}
        </table>
        <a href="${siteUrl}" style="display:inline-block;margin-top:16px;background:${NAVY};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">Explore the full assessment suite</a>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9aa3b2;line-height:1.6;margin:0;">
          You're receiving this email because you purchased a Verbal Reasoning Mastery report at ${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}. Reply to this email with any questions.
        </p>
      </td>
    </tr>`;
  return emailShell("Verbal Reasoning Mastery Report", rows);
}

/** Compact, URL-safe query string encoding a lead + answers, so an emailed link works without relying on the browser's session storage (e.g. on a different device). */
export function buildResultsQuery(lead: LeadInfo, indices: string, times: string): string {
  const params = new URLSearchParams({
    a: indices,
    t: times,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
  });
  return params.toString();
}

/** Resend resolves (rather than throws) on API-level failures, so every send must be checked. */
async function assertSent(result: { error: { message?: string } | null }, label: string) {
  if (result.error) {
    throw new Error(`Resend failed to send ${label}: ${result.error.message ?? "unknown error"}`);
  }
}

export async function sendTeaserEmail(params: {
  lead: LeadInfo;
  report: ScoreReport;
  resultsUrl: string;
  siteUrl: string;
}) {
  const from = process.env.EMAIL_FROM ?? "VerbRea <onboarding@resend.dev>";
  const html = buildTeaserEmailHtml(params.lead, params.report, params.resultsUrl, params.siteUrl);

  const result = await getResend().emails.send({
    from,
    to: params.lead.email,
    subject: `Your Verbal Reasoning Mastery Score: ${params.report.mastersScore} — unlock your full report`,
    html,
  });
  await assertSent(result, "teaser email");
}

export async function sendResultsEmail(params: {
  lead: LeadInfo;
  report: ScoreReport;
  answers: AnswerRecord[];
  resultsUrl: string;
  siteUrl: string;
}) {
  const from = process.env.EMAIL_FROM ?? "VerbRea <onboarding@resend.dev>";
  const html = buildResultsEmailHtml(
    params.lead,
    params.report,
    params.answers,
    params.resultsUrl,
    params.siteUrl
  );

  const result = await getResend().emails.send({
    from,
    to: params.lead.email,
    subject: `Your Verbal Reasoning Mastery Score: ${params.report.mastersScore} (${params.report.tier})`,
    html,
  });
  await assertSent(result, "results email");

  const notifyTo = process.env.SALES_NOTIFY_EMAIL;
  if (notifyTo) {
    // Best-effort internal notification — don't fail the customer-facing send over this.
    const notifyResult = await getResend().emails.send({
      from,
      to: notifyTo,
      subject: `New VerbRea purchase: ${params.lead.name}`,
      html: `<p style="font-family:Arial,sans-serif;font-size:14px;">New paid test completed.</p>
             <p style="font-family:Arial,sans-serif;font-size:14px;">Name: ${escapeHtml(params.lead.name)}<br/>
             Email: ${escapeHtml(params.lead.email)}<br/>
             Phone: ${escapeHtml(params.lead.phone)}<br/>
             Score: ${params.report.mastersScore} (${escapeHtml(params.report.tier)})</p>`,
    });
    if (notifyResult.error) {
      console.error("Resend failed to send sales notification:", notifyResult.error.message);
    }
  }
}
