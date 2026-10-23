import Link from "next/link";
import BusinessDetails from "./BusinessDetails";
import CookieSettingsButton from "./CookieSettingsButton";
import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2>{site.name}</h2>
          <BusinessDetails />
        </div>
        <nav aria-label="מידע משפטי">
          <h2>מידע</h2>
          <ul>
            <li><Link href="/terms">תקנון ותנאי שימוש</Link></li>
            <li><Link href="/cancellation">מדיניות ביטול עסקה</Link></li>
            <li><Link href="/privacy">מדיניות פרטיות</Link></li>
            <li><Link href="/accessibility">הצהרת נגישות</Link></li>
            <li><CookieSettingsButton /></li>
          </ul>
        </nav>
        <nav aria-label="קישורים">
          <h2>קישורים</h2>
          <ul>
            <li><Link href="/contact">יצירת קשר</Link></li>
            <li><Link href="/account">אזור אישי</Link></li>
            <li><Link href="/course">אזור הקורס</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container">
        <p className="fineprint" style={{ marginTop: 28 }}>
          © {new Date().getFullYear()} {site.name}. כל הזכויות שמורות. התוכן מיועד לגילאי {site.minAge}+ בלבד.
        </p>
      </div>
    </footer>
  );
}
