"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "../actions";
import FormAlert from "@/components/FormAlert";
import { site } from "@/config/site";

export default function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});
  if (state.message) return <FormAlert message={state.message} />;
  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="fullName">שם מלא</label>
        <input id="fullName" name="fullName" className="input" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">אימייל</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required dir="ltr" />
      </div>
      <div className="field">
        <label htmlFor="password">סיסמה</label>
        <input id="password" name="password" type="password" className="input" autoComplete="new-password" minLength={8} required dir="ltr" aria-describedby="pw-hint" />
        <small id="pw-hint" className="muted">לפחות 8 תווים</small>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="ageConfirm" required />
        <span>אני מצהיר/ה שמלאו לי {site.minAge} שנים לפחות.</span>
      </label>
      <label className="checkbox">
        <input type="checkbox" name="acceptTerms" required />
        <span>
          קראתי ואני מסכים/ה ל<Link href="/terms" target="_blank">תנאי השימוש</Link> ול
          <Link href="/privacy" target="_blank">מדיניות הפרטיות</Link>.
        </span>
      </label>
      <label className="checkbox">
        <input type="checkbox" name="marketing" />
        <span className="muted">(רשות) אשמח לקבל עדכונים ותוכן שיווקי באימייל. אפשר להסיר בכל עת.</span>
      </label>
      <FormAlert {...state} />
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "נרשם…" : "הרשמה"}
      </button>
      <p className="muted" style={{ margin: 0 }}>
        כבר יש לך חשבון? <Link href={`/login?next=${encodeURIComponent(next)}`}>לכניסה</Link>
      </p>
    </form>
  );
}
