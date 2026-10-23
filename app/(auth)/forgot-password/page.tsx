"use client";

import { useActionState } from "react";
import { forgotPassword, type AuthState } from "../actions";
import FormAlert from "@/components/FormAlert";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(forgotPassword, {});
  return (
    <div className="auth-wrap">
      <h1 style={{ fontSize: "2.2rem" }}>איפוס סיסמה</h1>
      <form action={action} className="form">
        <div className="field">
          <label htmlFor="email">אימייל</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" required dir="ltr" />
        </div>
        <FormAlert {...state} />
        <button className="btn btn-primary btn-block" disabled={pending}>שליחת קישור לאיפוס</button>
      </form>
    </div>
  );
}
