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
          <span className="logo-mark" aria-hidden="true">01</span>
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
