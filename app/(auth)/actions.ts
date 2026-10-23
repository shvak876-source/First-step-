"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { site } from "@/config/site";

export type AuthState = { error?: string; message?: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function login(_: AuthState, f: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: str(f, "email"),
    password: String(f.get("password") ?? ""),
  });
  if (error) {
    if (error.code === "email_not_confirmed") return { error: "יש לאשר את כתובת האימייל דרך הקישור שנשלח אליך." };
    return { error: "האימייל או הסיסמה שגויים." };
  }
  redirect(safeNext(f.get("next")));
}

export async function signup(_: AuthState, f: FormData): Promise<AuthState> {
  const email = str(f, "email");
  const password = String(f.get("password") ?? "");
  const fullName = str(f, "fullName");
  if (!fullName) return { error: "נא למלא שם מלא." };
  if (password.length < 8) return { error: "הסיסמה חייבת לכלול לפחות 8 תווים." };
  if (f.get("ageConfirm") !== "on") return { error: `ההרשמה מיועדת לגילאי ${site.minAge} ומעלה בלבד.` };
  if (f.get("acceptTerms") !== "on") return { error: "יש לאשר את תנאי השימוש ומדיניות הפרטיות." };

  const next = safeNext(f.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      data: {
        full_name: fullName,
        age_confirmed: "true",
        marketing_opt_in: f.get("marketing") === "on" ? "true" : "false",
      },
    },
  });
  if (error) {
    if (error.code === "user_already_exists") return { error: "כבר קיים חשבון עם האימייל הזה. אפשר להתחבר." };
    if (error.code === "weak_password") return { error: "הסיסמה חלשה מדי. נסו סיסמה ארוכה ומגוונת יותר." };
    return { error: "ההרשמה נכשלה. נסו שוב." };
  }
  // אם אימות אימייל כבוי ב-Supabase – יש סשן מיידי
  if (data.session) redirect(next);
  return { message: "נשלח אליך אימייל לאישור החשבון. לחץ/י על הקישור כדי להמשיך." };
}

export async function forgotPassword(_: AuthState, f: FormData): Promise<AuthState> {
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(str(f, "email"), {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });
  // תמיד אותה הודעה – לא חושפים אם האימייל קיים
  return { message: "אם קיים חשבון עם האימייל הזה, נשלח אליו קישור לאיפוס סיסמה." };
}

export async function resetPassword(_: AuthState, f: FormData): Promise<AuthState> {
  const password = String(f.get("password") ?? "");
  if (password.length < 8) return { error: "הסיסמה חייבת לכלול לפחות 8 תווים." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "לא הצלחנו לעדכן את הסיסמה. ייתכן שהקישור פג תוקף – בקשו קישור חדש." };
  redirect("/account?updated=password");
}
