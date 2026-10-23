"use client";

import { useActionState, useState } from "react";
import { requestCancellation, type AccountState } from "./actions";
import FormAlert from "@/components/FormAlert";

export default function CancelForm({ purchaseId }: { purchaseId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AccountState, FormData>(requestCancellation, {});
  if (state.message) return <FormAlert message={state.message} />;
  if (!open) {
    return (
      <button type="button" className="linklike" onClick={() => setOpen(true)}>
        ביטול עסקה
      </button>
    );
  }
  return (
    <form action={action} className="form" style={{ marginTop: 10 }}>
      <input type="hidden" name="purchaseId" value={purchaseId} />
      <div className="field">
        <label htmlFor={`reason-${purchaseId}`}>סיבת הביטול (רשות)</label>
        <textarea id={`reason-${purchaseId}`} name="reason" className="input" rows={3} maxLength={1000} />
      </div>
      <FormAlert error={state.error} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" disabled={pending}>שליחת הודעת ביטול</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>חזרה</button>
      </div>
    </form>
  );
}
