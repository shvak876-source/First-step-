import "server-only";
import { createClient } from "@/lib/supabase/server";
import { access } from "@/config/site";

export type Purchase = {
  id: string;
  provider_session_id: string;
  amount_agorot: number;
  currency: string;
  status: "paid" | "refunded";
  receipt_url: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  terms_version: string;
  created_at: string;
  refunded_at: string | null;
};

export function accessExpiresAt(p: Pick<Purchase, "created_at">): Date | null {
  if (!access.months) return null;
  const d = new Date(p.created_at);
  d.setMonth(d.getMonth() + access.months);
  return d;
}

export function isPurchaseActive(p: Purchase, now = new Date()): boolean {
  if (p.status !== "paid") return false;
  const exp = accessExpiresAt(p);
  return !exp || exp.getTime() > now.getTime();
}

/** כל הרכישות של המשתמש המחובר (RLS מגביל לשלו בלבד). */
export async function getPurchases(): Promise<Purchase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Purchase[];
}

export async function hasCourseAccess(): Promise<boolean> {
  const purchases = await getPurchases();
  return purchases.some((p) => isPurchaseActive(p));
}
