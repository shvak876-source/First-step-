"use client";

import { useActionState } from "react";
import { updateProfile, type AccountState } from "./actions";
import FormAlert from "@/components/FormAlert";

export default function ProfileForm({ fullName, marketing }: { fullName: string; marketing: boolean }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(updateProfile, {});
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="fullName">שם מלא</label>
        <input id="fullName" name="fullName" className="input" defaultValue={fullName} autoComplete="name" />
      </div>
      <label className="checkbox">
        <input type="checkbox" name="marketing" defaultChecked={marketing} />
        <span>אני מסכים/ה לקבל עדכונים ותוכן שיווקי באימייל</span>
      </label>
      <FormAlert {...state} />
      <button className="btn btn-ghost" disabled={pending}>שמירה</button>
    </form>
  );
}
