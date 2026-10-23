import type { Metadata } from "next";
import Link from "next/link";
import DraftBanner from "@/components/DraftBanner";
import { business, legalVersion, pricing } from "@/config/site";

export const metadata: Metadata = { title: "מדיניות ביטול עסקה" };

const fee = (price: number) => Math.min(price * 0.05, 100);
const ils = (n: number) => `${n.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₪`;

export default function CancellationPage() {
  return (
    <article className="prose">
      <DraftBanner />
      <h1>מדיניות ביטול עסקה</h1>
      <p className="muted">גרסה: {legalVersion}</p>
      <p>
        רכישת הקורס באתר היא &quot;עסקת מכר מרחוק&quot; לפי סעיף 14ג לחוק הגנת הצרכן, התשמ&quot;א-1981
        (&quot;החוק&quot;), ותקנות הגנת הצרכן (ביטול עסקה), התשע&quot;א-2010 (&quot;התקנות&quot;). מדיניות זו מסבירה מתי
        ואיך אפשר לבטל, וכמה כסף מוחזר.
      </p>

      <h2>1. תקופת הביטול</h2>
      <p>
        ניתן לבטל את העסקה תוך 14 ימים מיום ביצוע העסקה או מיום קבלת המסמך המפרט את פרטי העסקה (שנשלח
        אליך באימייל וזמין באזור האישי), לפי המאוחר מביניהם.
      </p>
      <p className="fineprint">
        לגבי אזרח ותיק (בן 65 ומעלה), אדם עם מוגבלות או עולה חדש – החוק קובע תקופת ביטול מוארכת של 4 חודשים
        בנסיבות מסוימות (בין היתר, כאשר ההתקשרות כללה שיחה עם העסק). אם אחד מאלה חל עליך – פנה/י אלינו.
        <span className="todo"> TODO לעו&quot;ד: לאשר תחולה על מכירה באתר בלבד.</span>
      </p>

      <h2>2. תוכן דיגיטלי שכבר נצפה</h2>
      <p>
        לפי סעיף 14ג(ד) לחוק, זכות הביטול אינה חלה על עסקאות מסוימות, ובהן עסקה ל&quot;מידע&quot; כהגדרתו בחוק
        המחשבים, התשנ&quot;ה-1995. קורס וידאו המועבר באופן דיגיטלי עשוי להיחשב ככזה, במיוחד לאחר שהצרכן החל
        לצפות בו.
      </p>
      <p>מדיניות העסק (מיטיבה ביחס לחריג):</p>
      <ul>
        <li>
          <strong>אם טרם צפית באף שיעור</strong> – ניתן לבטל בתוך תקופת הביטול ולקבל החזר מלא בניכוי דמי ביטול
          (ראו סעיף 3).
        </li>
        <li>
          <strong>אם כבר צפית בשיעור אחד או יותר</strong> – <span className="todo">TODO: לבחור אחת מהחלופות ולאשר עם עו&quot;ד:</span>
          <ul>
            <li>חלופה א׳: ניתן לבטל בתוך תקופת הביטול, בניכוי דמי ביטול בלבד (המדיניות הנדיבה ביותר).</li>
            <li>
              חלופה ב׳: ניתן לבטל רק אם נצפו עד <span className="todo">X</span> שיעורים; לאחר מכן לא ניתן לבטל
              בהסתמך על החריג בסעיף 14ג(ד).
            </li>
            <li>חלופה ג׳: לאחר תחילת הצפייה לא ניתן לבטל, בהסתמך על החריג בסעיף 14ג(ד).</li>
          </ul>
        </li>
      </ul>
      <p className="fineprint">
        האתר מתעד מועד פתיחה ראשונה של כל שיעור, לצורך בחינת בקשות ביטול בלבד.
      </p>

      <h2>3. דמי ביטול וסכום ההחזר</h2>
      <p>
        בביטול בתוך תקופת הביטול, יוחזר לך הסכום ששילמת בניכוי דמי ביטול בשיעור של 5% ממחיר העסקה או 100 ₪
        – לפי הנמוך מביניהם (סעיף 14ה לחוק והתקנות).
      </p>
      <div className="table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th scope="col">מחיר ששולם</th>
              <th scope="col">דמי ביטול</th>
              <th scope="col">החזר</th>
            </tr>
          </thead>
          <tbody>
            {[pricing.launchPrice, pricing.regularPrice].map((p) => (
              <tr key={p}>
                <td>{ils(p)}</td>
                <td>{ils(fee(p))}</td>
                <td>{ils(p - fee(p))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>לא ייגבו דמי ביטול</strong> אם הביטול נובע מפגם, מאי-התאמה בין התוכן לבין מה שהוצג, או מאי-מתן
        גישה לקורס במועד.
      </p>

      <h2>4. איך מבטלים</h2>
      <p>ניתן למסור הודעת ביטול בכל אחת מהדרכים הבאות:</p>
      <ul>
        <li>
          <strong>באתר:</strong> ב<Link href="/account">אזור האישי</Link> ← היסטוריית רכישות ← &quot;ביטול עסקה&quot;.
        </li>
        <li>
          <strong>באימייל:</strong> <a href={`mailto:${business.email}?subject=${encodeURIComponent("הודעת ביטול עסקה")}`}>{business.email}</a>
        </li>
        <li>
          <strong>בטלפון:</strong> <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>{business.phone}</a>
        </li>
        <li>
          <strong>בדואר:</strong> {business.address}
        </li>
      </ul>
      <p>בהודעה יש לציין שם מלא, האימייל שאיתו נרשמת, ומספר ההזמנה (אם ידוע).</p>

      <h2>5. מתי מקבלים את הכסף</h2>
      <p>
        ההחזר יבוצע תוך 14 ימים מקבלת הודעת הביטול, לאותו אמצעי תשלום שבו שולם (ביטול החיוב בכרטיס האשראי).
        העסק ימסור לך מסמך המאשר את ביטול העסקה. עם ביטול העסקה תיחסם הגישה לאזור הקורס.
      </p>

      <h2>6. יצירת קשר</h2>
      <p>
        לכל שאלה: <a href={`mailto:${business.email}`}>{business.email}</a> · {business.phone}
      </p>
    </article>
  );
}
