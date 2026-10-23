import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  return stripe;
}
