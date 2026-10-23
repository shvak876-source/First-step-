"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { hasCourseAccess } from "@/lib/access";
import { getStripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/env";
import { currentPrice, isLaunchActive, legalVersion, pricing, site } from "@/config/site";

export type CheckoutState = { error?: string };

export async function startCheckout(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const user = await getUser();
  if (!user) redirect("/login?next=/checkout");

  // אכיפה בצד השרת – לא רק בדפדפן
  if (formData.get("acceptTerms") !== "on") {
    return { error: "יש לאשר את התקנון ואת מדיניות הביטול כדי להמשיך לתשלום." };
  }
  if (formData.get("ageConfirm") !== "on") {
    return { error: `הקורס מיועד לגילאי ${site.minAge} ומעלה בלבד.` };
  }

  if (await hasCourseAccess()) redirect("/course");

  const now = new Date();
  const price = currentPrice(now);
  let url: string | null = null;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "auto",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pricing.currency.toLowerCase(),
            unit_amount: price * 100,
            product_data: {
              name: `קורס ${site.name}`,
              description: isLaunchActive(now)
                ? `מחיר השקה (במקום ${pricing.regularPrice} ₪)`
                : site.tagline,
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        terms_version: legalVersion,
        terms_accepted_at: now.toISOString(),
      },
      payment_intent_data: { metadata: { user_id: user.id } },
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout?canceled=1`,
    });
    url = session.url;
  } catch (e) {
    console.error("[checkout] stripe error", e);
    return { error: "לא הצלחנו לפתוח את דף התשלום. נסו שוב בעוד רגע." };
  }
  if (!url) return { error: "לא הצלחנו לפתוח את דף התשלום." };
  redirect(url);
}
