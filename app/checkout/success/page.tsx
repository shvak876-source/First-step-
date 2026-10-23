import type { Metadata } from "next";
import Link from "next/link";
import AutoRefresh from "./AutoRefresh";
import { hasCourseAccess } from "@/lib/access";
import { business } from "@/config/site";

export const metadata: Metadata = { title: "תודה על הרכישה" };
export const dynamic = "force-dynamic";

export default async function SuccessPage() {
  const ready = await hasCourseAccess();
  return (
    <div className="auth-wrap" style={{ textAlign: "center" }}>
      {ready ? (
        <>
          <p className="pill">הגישה אושרה</p>
          <h1 style={{ fontSize: "2.2rem" }}>ברוך הבא לקורס</h1>
          <p className="muted">התשלום התקבל והגישה לקורס פתוחה. הקבלה זמינה באזור האישי.</p>
          <Link href="/course" className="btn btn-primary btn-block">לשיעור הראשון</Link>
        </>
      ) : (
        <>
          <AutoRefresh />
          <h1 style={{ fontSize: "2.2rem" }}>מאשרים את התשלום…</h1>
          <p className="muted" role="status">
            זה לוקח בדרך כלל כמה שניות. העמוד יתעדכן אוטומטית. אם הגישה לא נפתחה תוך כמה דקות, פנו
            אלינו: <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </>
      )}
    </div>
  );
}
