import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { createInvoice } from "@/lib/invoice";
import { sendEmail } from "@/lib/email";
import { orderEmail } from "@/lib/order-email";
import { requireEnv } from "@/lib/env";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (e) {
    console.error("[webhook] bad signature", e);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handlePaidSession(event.data.object);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object);
        break;
    }
  } catch (e) {
    console.error(`[webhook] handler failed for ${event.type}`, e);
    // 500 => Stripe ינסה שוב מאוחר יותר
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}

async function handlePaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;
  const userId = session.metadata?.user_id || session.client_reference_id;
  if (!userId) throw new Error(`session ${session.id} has no user id`);

  const db = createServiceClient();
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const { data: inserted, error } = await db
    .from("purchases")
    .insert({
      user_id: userId,
      provider: "stripe",
      provider_session_id: session.id,
      provider_payment_id: paymentIntentId,
      amount_agorot: session.amount_total ?? 0,
      currency: (session.currency ?? "ils").toUpperCase(),
      status: "paid",
      customer_email: session.customer_details?.email ?? session.customer_email,
      customer_name: session.customer_details?.name ?? null,
      terms_version: session.metadata?.terms_version ?? "unknown",
      terms_accepted_at: session.metadata?.terms_accepted_at ?? new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    // 23505 = כבר טופל (Stripe שולח אירועים יותר מפעם אחת)
    if (error.code === "23505") return;
    throw error;
  }

  // מכאן – תוספות שלא חוסמות את הגישה. כישלון כאן לא מחזיר 500.
  const updates: Record<string, string> = {};
  try {
    if (paymentIntentId) {
      const pi = await getStripe().paymentIntents.retrieve(paymentIntentId, { expand: ["latest_charge"] });
      const charge = pi.latest_charge as Stripe.Charge | null;
      if (charge?.receipt_url) updates.receipt_url = charge.receipt_url;
    }
  } catch (e) {
    console.error("[webhook] could not fetch receipt url", e);
  }

  try {
    const invoice = await createInvoice({
      amountIls: (session.amount_total ?? 0) / 100,
      customerName: session.customer_details?.name ?? "",
      customerEmail: session.customer_details?.email ?? session.customer_email ?? "",
      description: `קורס וידאו "${site.name}" – 10 שיעורים`,
      paidAt: new Date(session.created * 1000),
      externalId: session.id,
    });
    if (invoice) {
      updates.invoice_number = invoice.number;
      updates.invoice_url = invoice.url;
    }
  } catch (e) {
    console.error("[webhook] invoice creation failed – issue manually!", session.id, e);
  }

  if (Object.keys(updates).length) {
    await db.from("purchases").update(updates).eq("id", inserted.id);
  }

  // מסמך פרטי העסקה ללקוח באימייל (סעיף 14ג(ב) לחוק הגנת הצרכן)
  const customerEmail = session.customer_details?.email ?? session.customer_email;
  if (customerEmail) {
    try {
      const mail = orderEmail({
        purchaseId: inserted.id,
        createdAt: new Date(session.created * 1000),
        amountIls: (session.amount_total ?? 0) / 100,
        customerEmail,
        customerName: session.customer_details?.name ?? "",
        termsVersion: session.metadata?.terms_version ?? "unknown",
        invoiceUrl: updates.invoice_url,
        receiptUrl: updates.receipt_url,
      });
      if (await sendEmail({ to: customerEmail, ...mail })) {
        await db.from("purchases").update({ order_email_sent_at: new Date().toISOString() }).eq("id", inserted.id);
      }
    } catch (e) {
      console.error("[webhook] order email failed – send manually!", session.id, e);
    }
  }
}

/** כל החזר (מלא או חלקי, למשל בניכוי דמי ביטול) מבטל את הגישה לקורס. */
async function handleRefund(charge: Stripe.Charge) {
  if (!charge.amount_refunded) return;
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;
  const db = createServiceClient();
  const { error } = await db
    .from("purchases")
    .update({ status: "refunded", refunded_at: new Date().toISOString() })
    .eq("provider_payment_id", paymentIntentId);
  if (error) throw error;
}
