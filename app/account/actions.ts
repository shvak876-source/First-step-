"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";

export type AccountState = { error?: string; message?: string };

export async function updateProfile(_: AccountState, f: FormData): Promise<AccountState> {
  const user = await getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(f.get("fullName") ?? "").trim() || null,
      marketing_opt_in: f.get("marketing") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) return { error: "השמירה נכשלה." };
  revalidatePath("/account");
  return { message: "הפרטים נשמרו." };
}

export async function requestCancellation(_: AccountState, f: FormData): Promise<AccountState> {
  const user = await getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const purchaseId = String(f.get("purchaseId") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.from("cancellation_requests").insert({
    user_id: user.id,
    purchase_id: purchaseId,
    reason: String(f.get("reason") ?? "").slice(0, 1000) || null,
  });
  if (error) return { error: "לא הצלחנו לשלוח את בקשת הביטול. אפשר לפנות אלינו גם באימייל או בטלפון." };
  revalidatePath("/account");
  return { message: "הודעת הביטול התקבלה. נטפל בה ונעדכן אותך באימייל בהתאם למדיניות הביטול." };
}
