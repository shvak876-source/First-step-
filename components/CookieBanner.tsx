"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const c = readConsent();
    if (!c) setOpen(true);
    const onOpen = () => {
      const cur = readConsent();
      setAnalytics(Boolean(cur?.analytics));
      setMarketing(Boolean(cur?.marketing));
      setDetails(true);
      setOpen(true);
      setTimeout(() => headingRef.current?.focus(), 0);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  if (!open) return null;

  const done = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setOpen(false);
  };

  return (
    <section className="cookie-banner" role="region" aria-labelledby="cookie-title">
      <h2 id="cookie-title" ref={headingRef} tabIndex={-1} style={{ fontSize: "1.1rem", fontFamily: "var(--font-body)", fontWeight: 700 }}>
        עוגיות באתר
      </h2>
      <p className="muted" style={{ margin: 0 }}>
        אנחנו משתמשים בעוגיות הכרחיות כדי שהאתר יעבוד (התחברות, אבטחה, שמירת ההעדפות שלך). עוגיות
        סטטיסטיקה ושיווק יופעלו רק אם תאשר/י. <Link href="/privacy#cookies">פרטים במדיניות הפרטיות</Link>.
      </p>

      {details && (
        <fieldset style={{ border: 0, padding: 0, margin: "12px 0 0", display: "grid", gap: 8 }}>
          <legend className="sr-only">בחירת סוגי עוגיות</legend>
          <label className="checkbox">
            <input type="checkbox" checked disabled /> <span>הכרחיות – תמיד פעילות</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span>סטטיסטיקה – מדידת שימוש באתר</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>שיווק – פרסום מותאם</span>
          </label>
        </fieldset>
      )}

      <div className="actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => done(true, true)}>
          אישור הכל
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => done(false, false)}>
          רק הכרחיות
        </button>
        {details ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => done(analytics, marketing)}>
            שמירת הבחירה
          </button>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetails(true)}>
            התאמה אישית
          </button>
        )}
      </div>
    </section>
  );
}
