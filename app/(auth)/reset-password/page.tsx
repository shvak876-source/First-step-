"use client";

import { useActionState } from "react";
import { resetPassword, type AuthState } from "../actions";
import FormAlert from "@/components/FormAlert";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(resetPassword, {});
  return (
    <div className="auth-wrap">
      <h1 style={{ fontSize: "2.2rem" }}>בחירת סיסמה חדשה</h1>
      <form action={action} className="form">
        <div className="field">
          <label htmlFor="password">סיסמה חדשה</label>
          <input id="password" name="password" type="password" className="input" autoComplete="new-password" minLength={8} required dir="ltr" />
        </div>
        <FormAlert {...state} />
        <button className="btn btn-primary btn-block" disabled={pending}>עדכון סיסמה</button>
      </form>
    </div>
  );
}
