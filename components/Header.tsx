import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { site } from "@/config/site";

export default async function Header() {
  let user = null;
  try {
    user = await getUser();
  } catch {
    // Supabase לא מוגדר עדיין – מציגים כאורח
  }
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo" aria-label={`${site.name} – לדף הבית`}>
          <span className="logo-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
          </span>
          {site.name}
        </Link>
        <nav className="nav" aria-label="ניווט ראשי">
          <ul className="nav-links">
            <li><Link href="/#lessons">השיעורים</Link></li>
            <li><Link href="/#pricing">מחיר</Link></li>
            <li><Link href="/#faq">שאלות נפוצות</Link></li>
          </ul>
          {user ? (
            <>
              <Link href="/course" className="btn btn-ghost btn-sm">לקורס</Link>
              <Link href="/account" className="btn btn-ghost btn-sm">אזור אישי</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">כניסה</Link>
              <Link href="/checkout" className="btn btn-primary btn-sm">לרכישה</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
