import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import { access, faq, included, lessons, pricing, site, testimonials } from "@/config/site";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div>
          <div className="file-meta" aria-hidden="true" dir="ltr">
            <span>FILE #001</span>
            <span>CLASSIFICATION: 18+</span>
            <span>LESSONS: 10</span>
          </div>
          <p className="stamp">סודי ביותר</p>
          <h1 id="hero-title">
            הסוד שבנות <span className="glow-red">לא ירצו</span> שתדע
          </h1>
          <p className="lead">
            אין פה טריקים ואין משפטים מוכנים. יש פה מה שבאמת עובד: <span className="glow-teal">ביטחון עצמי</span>,
            נוכחות וכבוד – ב-10 שיעורי וידאו קצרים ומעשיים.
          </p>
          <div className="hero-cta">
            <Link href="/checkout" className="btn btn-primary">
              אני רוצה גישה לתיק
            </Link>
            <Link href="#lessons" className="btn btn-ghost">
              מה יש בפנים?
            </Link>
          </div>
          </div>
          <div className="dossier" aria-hidden="true">
            <div className="dossier-tab">TOP SECRET</div>
            <p className="dossier-line">נושא: ביטחון עצמי</p>
            <p className="dossier-line">סטטוס: <span className="glow-teal">פתוח לצפייה</span></p>
            <p className="dossier-line"><span className="redacted">██████████</span></p>
            <p className="dossier-line">שיעורים: 10</p>
            <p className="dossier-line"><span className="redacted">████████████████</span></p>
            <p className="dossier-stamp">מאושר 18+</p>
          </div>
        </div>
      </section>

      {/* ---------- מה מקבלים ---------- */}
      <section className="section" aria-labelledby="included-title">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: 32 }}>
          <div>
            <p className="eyebrow">מה בתיק</p>
            <h2 id="included-title">
              כל מה שצריך כדי לעשות את <span className="glow-gold">הצעד הראשון</span>
            </h2>
            <p className="muted">
              הקורס בנוי כך שתוכל ליישם כבר מהשיעור הראשון. בלי חפירות, בלי תיאוריות – רק כלים
              שאפשר לקחת לשטח.
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
          <p className="eyebrow">10 קבצים</p>
          <h2 id="lessons-title">תוכנית הקורס</h2>
          <ol className="lesson-files">
            {lessons.map((l) => (
              <li key={l.slug} className="lesson-file">
                <span className="num" aria-hidden="true">{String(l.number).padStart(2, "0")}</span>
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
          <p className="eyebrow">עדויות</p>
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
