import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Lazily-instantiated Stripe client. Never import this into client components. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it in your Vercel project's Environment Variables."
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export const PRICE_USD_CENTS = 199; // $1.99 discounted price
export const ORIGINAL_PRICE_USD_CENTS = 999; // $9.99 anchor price shown as struck-through
