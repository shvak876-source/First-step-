"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { startCheckout, type CheckoutState } from "./actions";
import FormAlert from "@/components/FormAlert";
import { site } from "@/config/site";

export default function CheckoutForm({ canceled }: { canceled: boolean }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startCheckout, {});
  const [terms, setTerms] = useState(false);
  const [age, setAge] = useState(false);
  return (
    <form action={action} className="form">
      {canceled && !state.error && <FormAlert message="התשלום בוטל ולא חויבת. אפשר לנסות שוב בכל עת." />}
      <label className="checkbox">
        <input type="checkbox" name="ageConfirm" required checked={age} onChange={(e) => setAge(e.target.checked)} />
        <span>אני מצהיר/ה שמלאו לי {site.minAge} שנים לפחות.</span>
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          name="acceptTerms"
          required
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          aria-describedby="terms-hint"
        />
        <span>
          קראתי ואני מסכים/ה ל<Link href="/terms" target="_blank">תקנון</Link> ול
          <Link href="/cancellation" target="_blank">מדיניות הביטול</Link>. <span aria-hidden="true">*</span>
          <span className="sr-only">(שדה חובה)</span>
        </span>
      </label>
      <small id="terms-hint" className="muted">
        יש לסמן את שתי התיבות כדי להמשיך לתשלום. שימו לב: הקורס הוא תוכן דיגיטלי – זכות הביטול לאחר
        תחילת הצפייה מוגבלת כמפורט ב<Link href="/cancellation" target="_blank">מדיניות הביטול</Link>.
      </small>
      <FormAlert error={state.error} />
      <button className="btn btn-primary btn-block" disabled={pending || !terms || !age}>
        {pending ? "פותח דף תשלום מאובטח…" : "המשך לתשלום מאובטח"}
      </button>
      <p className="fineprint" style={{ margin: 0 }}>
        התשלום מתבצע בדף מאובטח של ספק הסליקה. פרטי האשראי אינם עוברים דרכנו ואינם נשמרים אצלנו.
      </p>
    </form>
  );
}
