import type { Metadata } from "next";
import BusinessDetails from "@/components/BusinessDetails";
import { accessibilityCoordinator as ac, business } from "@/config/site";

export const metadata: Metadata = { title: "יצירת קשר" };

export default function ContactPage() {
  return (
    <article className="prose">
      <p className="eyebrow">דברו איתנו</p>
      <h1>יצירת קשר</h1>
      <p>יש שאלה על הקורס, תקלה בגישה או בקשת ביטול? אפשר לפנות אלינו בכל אחת מהדרכים הבאות.</p>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>פרטי העסק</h2>
        <BusinessDetails />
        <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>שעות מענה: {business.hours}</p>
      </div>
      <h2>נגישות</h2>
      <p>
        לפניות בנושא נגישות: {ac.name} · <a href={`mailto:${ac.email}`}>{ac.email}</a> · {ac.phone}
      </p>
    </article>
  );
}
