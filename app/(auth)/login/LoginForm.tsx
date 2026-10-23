"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "../actions";
import FormAlert from "@/components/FormAlert";

export default function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {
    error: linkError ? "הקישור אינו תקף או שפג תוקפו. נסו להתחבר או לבקש קישור חדש." : undefined,
  });
  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">אימייל</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required dir="ltr" />
      </div>
      <div className="field">
        <label htmlFor="password">סיסמה</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required dir="ltr" />
      </div>
      <FormAlert {...state} />
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "מתחבר…" : "כניסה"}
      </button>
      <p className="muted" style={{ margin: 0 }}>
        <Link href="/forgot-password">שכחתי סיסמה</Link> · אין לך חשבון?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`}>להרשמה</Link>
      </p>
    </form>
  );
}
