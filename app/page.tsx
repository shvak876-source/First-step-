import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import { access, faq, included, lessons, pricing, site, testimonials } from "@/config/site";

export const dynamic = "force-dynamic";

/** "לפני / אחרי" – מה משתנה אצל מי שעושה את הקורס. TODO: להתאים לתוכן השיעורים בפועל. */
const shifts: { before: string; after: string }[] = [
  { before: "רואה מישהי שמעניינת אותך – ונשאר במקום", after: "ניגש בנינוחות ופותח שיחה, בלי משפט מוכן" },
  { before: "כותב ״היי מה קורה״ באפליקציה ומחכה", after: "שולח הודעה ראשונה שבאמת מזמינה תשובה" },
  { before: "בדייט מרגיש כאילו אתה במבחן", after: "נהנה מהדייט, סקרן ונוכח" },
  { before: "״לא״ אחד הורס לך את השבוע", after: "מקבל ״לא״ בכבוד וממשיך הלאה בביטחון" },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div>
            <p className="pill">
              קורס וידאו · {lessons.length} שיעורים · {site.minAge}+
            </p>
            <h1 id="hero-title">
              הסוד שבנות <span className="glow-red">לא ירצו</span> שתדע
            </h1>
            <p className="lead">
              אין פה טריקים ואין משפטים מוכנים. יש פה מה שבאמת עובד בדייטים: <span className="glow-teal">ביטחון עצמי</span>,
              נוכחות וכבוד – ב-10 שיעורי וידאו קצרים ומעשיים.
            </p>
            <div className="hero-cta">
              <Link href="/checkout" className="btn btn-primary">
                אני רוצה להתחיל
              </Link>
              <Link href="#lessons" className="btn btn-ghost">
                מה לומדים בקורס?
              </Link>
            </div>
          </div>

          {/* המחשה: שיחה באפליקציית היכרויות */}
          <figure className="chat-phone" aria-label="המחשה: התכתבות באפליקציית היכרויות">
            <div className="chat-head" aria-hidden="true">
              <span className="chat-avatar">נ</span>
              <span>
                <strong>נועה</strong>
                <small>פעילה עכשיו</small>
              </span>
            </div>
            <ol className="chat-body">
              <li className="msg me">היי נועה, ראיתי שטיילת בפטגוניה. איזה מסלול הכי שבר אותך?</li>
              <li className="msg her">האמת? טורס דל פאינה. היה הזוי 😅</li>
              <li className="msg me">נשמע שיש פה סיפור שלם. קפה ביום חמישי ותספרי לי?</li>
              <li className="msg her">יאללה, סגור ☕</li>
            </ol>
            <figcaption className="chat-caption">המחשה · מתוך שיעור 6: הודעות ואפליקציות</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- ערכים ---------- */}
      <div className="values" role="note">
        <div className="container">
          <span>בלי טריקים</span>
          <span aria-hidden="true">·</span>
          <span>בלי מניפולציות</span>
          <span aria-hidden="true">·</span>
          <span className="glow-gold">ביטחון, כבוד והסכמה</span>
        </div>
      </div>

      {/* ---------- לפני / אחרי ---------- */}
      <section className="section" aria-labelledby="shift-title">
        <div className="container">
          <p className="eyebrow">מכיר את זה?</p>
          <h2 id="shift-title">
            מה <span className="glow-teal">משתנה</span> אחרי הקורס
          </h2>
          <ul className="shifts">
            {shifts.map((s) => (
              <li key={s.before} className="shift">
                <p className="shift-before">
                  <span className="sr-only">היום: </span>
                  {s.before}
                </p>
                <span className="shift-arrow" aria-hidden="true">←</span>
                <p className="shift-after">
                  <span className="sr-only">אחרי הקורס: </span>
                  {s.after}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- מה מקבלים ---------- */}
      <section className="section" aria-labelledby="included-title">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: 32 }}>
          <div>
            <p className="eyebrow">מה מקבלים</p>
            <h2 id="included-title">
              כל מה שצריך כדי לעשות את <span className="glow-gold">הצעד הראשון</span>
            </h2>
            <p className="muted">
              הקורס בנוי כך שתוכל ליישם כבר מהשיעור הראשון – בבר, באפליקציה או בדייט הבא. בלי חפירות,
              רק כלים שלוקחים לשטח.
            </p>
          </div>
          <div className="card card-accent">
            <ul className="check-list">
              {included.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>{access.description}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- השיעורים ---------- */}
      <section id="lessons" className="section" aria-labelledby="lessons-title">
        <div className="container">
          <p className="eyebrow">תוכנית הקורס</p>
          <h2 id="lessons-title">10 שיעורים, צעד אחרי צעד</h2>
          <ol className="lesson-files">
            {lessons.map((l) => (
              <li key={l.slug} className="lesson-file">
                <span className="num" aria-hidden="true">{l.number}</span>
                <h3>
                  <span className="sr-only">שיעור {l.number}: </span>
                  {l.title}
                </h3>
                <p>{l.summary}</p>
                <span className="dur">
                  <span className="sr-only">משך: </span>
                  {l.duration}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- מחיר ---------- */}
      <section id="pricing" className="section" aria-labelledby="pricing-title">
        <div className="container">
          <div className="card card-accent price-box">
            <p className="eyebrow" style={{ justifyContent: "center" }}>גישה מלאה</p>
            <h2 id="pricing-title">קורס {site.name}</h2>
            <PriceTag />
            <p className="fineprint">{pricing.vatNote} תשלום חד-פעמי, ללא מנוי וללא חיובים נוספים.</p>
            <Link href="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
              לרכישה מאובטחת
            </Link>
            <p className="fineprint" style={{ marginTop: 12 }}>
              הרכישה כפופה ל<Link href="/terms">תקנון</Link> ול<Link href="/cancellation">מדיניות הביטול</Link>.
              לגילאי {site.minAge}+ בלבד.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- המלצות ---------- */}
      <section className="section" aria-labelledby="testimonials-title">
        <div className="container">
          <p className="eyebrow">המלצות</p>
          <h2 id="testimonials-title">מה אומרים המשתתפים</h2>
          {testimonials.length === 0 ? (
            <div className="card" style={{ borderStyle: "dashed", textAlign: "center" }}>
              <p className="muted" style={{ margin: 0 }}>
                הקורס חדש, ולכן עדיין אין כאן המלצות. אנחנו נפרסם כאן רק המלצות אמיתיות של משתתפים,
                ובאישורם.
              </p>
            </div>
          ) : (
            <ul className="grid grid-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {testimonials.map((t) => (
                <li key={t.name} className="card">
                  <blockquote style={{ margin: 0 }}>
                    <p>״{t.text}״</p>
                    <footer className="muted">— {t.name}</footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="eyebrow">שאלות</p>
          <h2 id="faq-title">שאלות נפוצות</h2>
          <div className="faq">
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div>{f.a}</div>
              </details>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/checkout" className="btn btn-primary">
              מוכן לצעד הראשון
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
