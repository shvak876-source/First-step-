import type { Metadata } from "next";
import Link from "next/link";
import { hasCourseAccess } from "@/lib/access";

export const metadata: Metadata = { title: "אזור הקורס", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasCourseAccess())) {
    return (
      <div className="auth-wrap" style={{ textAlign: "center" }}>
        <p className="stamp">גישה מוגבלת</p>
        <h1 style={{ fontSize: "2rem" }}>התיק נעול</h1>
        <p className="muted">
          אזור הקורס פתוח למי שרכש את הקורס. אם כבר שילמת והגישה עדיין לא נפתחה – בדוק/י את האזור
          האישי או פנה/י אלינו.
        </p>
        <div className="grid" style={{ gap: 10 }}>
          <Link href="/checkout" className="btn btn-primary btn-block">לרכישת הקורס</Link>
          <Link href="/account" className="btn btn-ghost btn-block">לאזור האישי</Link>
        </div>
      </div>
    );
  }
  return <div className="container">{children}</div>;
}
