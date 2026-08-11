# VerbRea — Verbal Reasoning Mastery Test

A GRE Verbal / LSAT Logical Reasoning–calibre assessment that measures
cognitive efficiency: how fast and accurately a person processes language,
evaluates arguments, and extracts logical conclusions.

Flow: landing page → lead capture (name, email, phone) → 24-question timed
test across four categories (Deductive Reasoning, Critical Reasoning,
Reading Comprehension, Verbal Precision) → results teaser with a paywall →
Stripe Checkout ($1.99, discounted from $9.99) → full report + upsell
offers emailed via Resend.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- Self-hosted fonts via `@fontsource` (Fraunces + Inter) — no external font
  CDN dependency, so text renders consistently across platforms
- Procedurally generated WebP/PNG artwork (`scripts/build-images.mjs` +
  `sharp`) instead of flat inline SVG icons — see `public/images/`
- Stripe Checkout (redirect flow, no client-side Stripe.js needed)
- Resend for transactional email
- No database — the test submission travels through Stripe Checkout
  `metadata` and is recomputed server-side from the webhook

## Environment variables

Copy `.env.example` to `.env.local` for local development, and set the same
keys in the Vercel project's Environment Variables for deployment:

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `/api/webhook` endpoint |
| `RESEND_API_KEY` | Resend API key used to send the results email |
| `EMAIL_FROM` | Verified sender, e.g. `VerbRea <results@yourdomain.com>` |
| `SALES_NOTIFY_EMAIL` | Optional — internal notification on each purchase |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used in Stripe redirect/email links |

### Stripe webhook setup

In the Stripe Dashboard, create a webhook endpoint pointing at
`https://<your-domain>/api/webhook` listening for `checkout.session.completed`,
then copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

## Development

```bash
npm install
npm run dev
```

## Regenerating artwork

```bash
node scripts/build-images.mjs
```

Regenerates all hero/emblem/badge/OG images in `public/images/` from the
procedural generator (gradient mesh + node-network scenes rasterized to
WebP/PNG via `sharp`).

## Build

```bash
npm run build
```
