import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import { access, faq, included, lessons, pricing, site, testimonials } from "@/config/site";

export const dynamic = "force-dynamic";

/** "תפסיק / תתחיל" – TODO: להתאים לתוכן השיעורים בפועל. */
const stop = [
  "לחכות לרגע המושלם",
  "לשלוח ״היי מה קורה״ ולקוות לטוב",
  "לשבת בצד כשמישהי מעניינת אותך",
  "לתת ל״לא״ אחד להרוס לך את השבוע",
];
const start = [
  "לגשת ולפתוח שיחה – בלי משפט מוכן",
  "לכתוב הודעה ראשונה שמקבלת תשובה",
  "להגיע לדייט נינוח, סקרן ונוכח",
  "לקבל ״לא״ בכבוד ולהמשיך קדימה",
];

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" aria-labelledby="hero-title">
        <span className="hero-bg-word" aria-hidden="true">ביטחון</span>
        <div className="container">
          <p className="hero-tag">
            <span>תוכנית אימון לביטחון עצמי ודייטינג · {site.minAge}+</span>
          </p>
          <h1 id="hero-title">
            הסוד שבנות{" "}
            <span className="hl">
              <span>לא ירצו</span>
            </span>{" "}
            שתדע
          </h1>
          <p className="kicker">
            תפסיק לחכות. <span className="glow-red">תתחיל לפעול.</span>
          </p>
          <p className="lead">
            {lessons.length} שיעורי וידאו קצרים וחדים שיבנו לך ביטחון אמיתי – באפליקציה, בבר ובדייט. בלי
            טריקים, בלי משפטים מוכנים. רק עבודה שמביאה תוצאות.
          </p>
          <div className="hero-cta">
            <Link href="/checkout" className="btn btn-primary">
              אני מתחיל עכשיו
            </Link>
            <Link href="#lessons" className="btn btn-ghost">
              לתוכנית המלאה
            </Link>
          </div>

          <ul className="stats" aria-label="הקורס במספרים">
            <li>
              <strong>{lessons.length}</strong>
              <span>שיעורי וידאו</span>
            </li>
            <li>
              <strong>{access.months || "∞"}</strong>
              <span>{access.months ? "חודשי גישה" : "גישה ללא הגבלה"}</span>
            </li>
            <li>
              <strong>0</strong>
              <span>טריקים ומניפולציות</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- פס אלכסוני ---------- */}
      <div className="band" role="note">
        <div className="band-inner">
          <span>ביטחון</span>
          <span aria-hidden="true">/</span>
          <span>נוכחות</span>
          <span aria-hidden="true">/</span>
          <span>כבוד</span>
          <span aria-hidden="true">/</span>
          <span>פעולה</span>
        </div>
      </div>

      {/* ---------- תפסיק / תתחיל ---------- */}
      <section className="section" aria-labelledby="shift-title">
        <div className="container">
          <p className="eyebrow">השינוי</p>
          <h2 id="shift-title">מהיום זה נראה אחרת</h2>
          <div className="stopstart">
            <div className="ss-col ss-stop">
              <h3>תפסיק</h3>
              <ul>
                {stop.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="ss-col ss-start">
              <h3>תתחיל</h3>
              <ul>
                {start.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- תוכנית האימון ---------- */}
      <section id="lessons" className="section" aria-labelledby="lessons-title">
        <div className="container">
          <p className="eyebrow">תוכנית האימון</p>
          <h2 id="lessons-title">{lessons.length} שלבים. צעד אחרי צעד.</h2>
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

      {/* ---------- מה מקבלים ---------- */}
      <section className="section" aria-labelledby="included-title">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: 32 }}>
          <div>
            <p className="eyebrow">מה מקבלים</p>
            <h2 id="included-title">כל הכלים. בלי חפירות.</h2>
            <p className="muted">
              כל שיעור נגמר במשימה אחת לביצוע בשטח. צופים, מתרגלים, ומרגישים את ההבדל כבר מהשבוע הראשון.
            </p>
          </div>
          <div className="card">
            <ul className="check-list">
              {included.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>{access.description}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- מחיר ---------- */}
      <section id="pricing" className="section" aria-labelledby="pricing-title">
        <div className="container">
          <div className="card card-accent price-box">
            <p className="eyebrow" style={{ justifyContent: "center" }}>גישה מלאה לקורס</p>
            <h2 id="pricing-title">{site.name}</h2>
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
        </div>
      </section>

      {/* ---------- קריאה לפעולה ---------- */}
      <section className="final-cta" aria-labelledby="final-title">
        <div className="container">
          <h2 id="final-title">הצעד הראשון הוא שלך.</h2>
          <p>אף אחד לא יעשה אותו בשבילך.</p>
          <Link href="/checkout" className="btn">
            אני מתחיל עכשיו
          </Link>
        </div>
      </section>
    </>
  );
}
