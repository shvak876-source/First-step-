# הצעד הראשון – אתר קורס (Next.js + Supabase + Stripe)

אתר קורס וידאו בעברית (RTL): דף נחיתה, הרשמה/התחברות, תשלום, אזור קורס מוגן, אזור אישי ועמודים משפטיים.

> ⚠ **כל הטקסטים המשפטיים באתר (תקנון, ביטול, פרטיות, נגישות) הם טיוטה בלבד** ומסומנים כך באתר.
> יש להעביר אותם לבדיקת עורך דין לפני עלייה לאוויר.

## מבנה

| נתיב | תיאור |
|---|---|
| `config/site.ts` | **הקובץ המרכזי לעריכה**: פרטי עסק, מחירים, תאריך סוף השקה, שיעורים, FAQ, המלצות, רכז נגישות |
| `supabase/migrations/0001_init.sql` | טבלאות, הרשאות (RLS) ו-bucket הסרטונים |
| `app/page.tsx` | דף נחיתה |
| `app/(auth)/*` | הרשמה, כניסה, שכחתי סיסמה |
| `app/checkout/*` | עמוד רכישה (תיבת הסכמה חובה) ופתיחת Stripe Checkout |
| `app/api/stripe/webhook/route.ts` | קבלת אישור תשלום → פתיחת גישה + קבלה/חשבונית; החזר → חסימת גישה |
| `app/course/*` | אזור הקורס: נגן, רשימת שיעורים, "צפיתי", אחוז התקדמות |
| `app/account/*` | אזור אישי: פרטים, היסטוריית רכישות, קבלות, בקשת ביטול |
| `app/{terms,cancellation,privacy,accessibility,contact}` | עמודים משפטיים |
| `lib/invoice.ts` | חיבור להפקת חשבוניות (Morning / חשבונית ירוקה) |

## משתני סביבה

| משתנה | חובה | מאיפה |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✓ | כתובת האתר, למשל `https://www.example.co.il` (בלי `/` בסוף) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | Supabase → Project Settings → API → anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | Supabase → Project Settings → API → service_role / secret key (**סודי!**) |
| `SUPABASE_VIDEO_BUCKET` | | ברירת מחדל `course-videos` |
| `STRIPE_SECRET_KEY` | ✓ | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | ✓ | Stripe → Developers → Webhooks → ה-endpoint → Signing secret |
| `INVOICE_PROVIDER` | | `none` (ברירת מחדל) או `greeninvoice` |
| `GREENINVOICE_API_KEY_ID` / `GREENINVOICE_API_KEY_SECRET` | אם greeninvoice | Morning → הגדרות → כלי מפתחים → מפתחות API |
| `GREENINVOICE_API_URL` | | sandbox: `https://sandbox.d.greeninvoice.co.il/api/v1`, ייצור: `https://api.greeninvoice.co.il/api/v1` |
| `GREENINVOICE_DOCUMENT_TYPE` | | `320` חשבונית מס/קבלה (עוסק מורשה/חברה), `400` קבלה (עוסק פטור) |

ראו גם `.env.example`.

## התקנה מקומית

```bash
npm install
cp .env.example .env.local   # ולמלא ערכים
npm run dev
```

## 1. הקמת Supabase

1. פותחים פרויקט ב-[supabase.com](https://supabase.com). מומלץ לבחור אזור באירופה (למשל Frankfurt).
2. **SQL Editor → New query** → מדביקים את כל `supabase/migrations/0001_init.sql` → Run.
3. **Authentication → URL Configuration**:
   - Site URL: כתובת האתר.
   - Redirect URLs: להוסיף `https://YOUR-DOMAIN/auth/callback` (ו-`http://localhost:3000/auth/callback` לפיתוח).
4. **Authentication → Sign In / Providers → Email**: להשאיר "Confirm email" פעיל.
5. **Authentication → Emails**: לתרגם את תבניות האימייל לעברית. מומלץ לחבר SMTP משלכם
   (Resend / Postmark וכו') – לשרת המובנה של Supabase יש מגבלת שליחה נמוכה.

## 2. חיבור Stripe

1. פותחים חשבון ב-[stripe.com](https://stripe.com) ומשלימים אימות עסק (Stripe תומך בעסקים בישראל ובחיוב ב-ILS).
2. מעתיקים את `STRIPE_SECRET_KEY` (בהתחלה מפתח `sk_test_...`).
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://YOUR-DOMAIN/api/stripe/webhook`
   - אירועים: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
   - מעתיקים את ה-Signing secret ל-`STRIPE_WEBHOOK_SECRET`.
4. בדיקה מקומית עם Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # מעתיקים את whsec_... שהפקודה מדפיסה ל-.env.local
   ```
   כרטיס בדיקה: `4242 4242 4242 4242`, תאריך עתידי כלשהו, CVC כלשהו.
5. **ביטול והחזר**: מבצעים Refund ב-Stripe Dashboard (מלא, או חלקי בניכוי דמי ביטול).
   ה-webhook `charge.refunded` חוסם את הגישה אוטומטית. בקשות ביטול שנשלחו מהאתר נמצאות
   בטבלה `cancellation_requests` ב-Supabase (Table Editor) – לעדכן שם את הסטטוס ידנית.

**המחיר נקבע בשרת** לפי `config/site.ts` (אין צורך ליצור Product/Price ב-Stripe). אחרי `launchEndsAt`
המחיר עובר אוטומטית ל-100 ₪.

### ספק סליקה ישראלי במקום Stripe (Cardcom / Tranzila / PayPlus / Meshulam וכו')
הלוגיקה מבודדת בשני קבצים:
- `app/checkout/actions.ts` – יוצרים שם דף תשלום אצל הספק (במקום `stripe.checkout.sessions.create`) ומעבירים
  את `user.id`, `legalVersion` ומועד ההסכמה כשדות מותאמים.
- `app/api/stripe/webhook/route.ts` – יוצרים route מקביל ל-IPN/callback של הספק, מאמתים את החתימה/העסקה
  מול ה-API שלו, ומכניסים שורה ל-`purchases` באותו מבנה (`provider_session_id` ייחודי = אידמפוטנטיות).
  לרוב הספקים הישראליים יש גם הפקת חשבונית מובנית – אז אפשר להשאיר `INVOICE_PROVIDER=none` ולשמור את קישור
  המסמך שהם מחזירים ב-`invoice_url`.

## 3. קבלות וחשבוניות

קבלת Stripe **אינה** מסמך חשבונאי תקף בישראל. אפשרויות:
- **אוטומטי (מומלץ)**: חשבון ב-Morning (חשבונית ירוקה) עם גישת API → `INVOICE_PROVIDER=greeninvoice` + המפתחות.
  בדקו תחילה בסביבת sandbox, ואמתו את מבנה הבקשה ב-`lib/invoice.ts` מול התיעוד העדכני שלהם. Morning שולחים את
  המסמך ללקוח באימייל, והקישור נשמר ומוצג באזור האישי.
- **ידני**: להשאיר `none` ולהפיק קבלה ידנית לכל רכישה (לא מומלץ). אם הפקה אוטומטית נכשלת – זה מופיע בלוגים
  (`invoice creation failed – issue manually!`).

## 4. העלאת סרטונים

1. מכינים את הקבצים: **MP4 (H.264 + AAC)**, מומלץ 720p–1080p, ‎faststart (`ffmpeg -i in.mov -c:v libx264 -crf 23 -preset slow -c:a aac -movflags +faststart 01.mp4`).
2. מכינים קובצי כתוביות **WebVTT** בעברית (חובה לנגישות). דוגמה בקובץ `docs/sample.he.vtt`.
3. Supabase → **Storage → course-videos** (bucket פרטי, נוצר ע"י ה-SQL) → יוצרים תיקייה `lessons` ומעלים:
   ```
   lessons/01.mp4   lessons/01.he.vtt
   lessons/02.mp4   lessons/02.he.vtt
   ...
   lessons/10.mp4   lessons/10.he.vtt
   ```
4. **מגבלת גודל**: בתוכנית החינמית מגבלת קובץ היא 50MB. בתוכנית Pro אפשר להגדיל ב-Storage → Settings
   (עד עשרות GB). לקבצים מעל ~6MB מומלץ להעלות דרך הדשבורד (תומך בהעלאה מחודשת) או עם `supabase` CLI.
5. הנתיבים מוגדרים ב-`config/site.ts` (`videoPath` / `captionsPath`). שיעור שאין לו קובץ יציג "הסרטון יעלה בקרוב".
6. הקישורים החתומים תקפים 3 שעות ונוצרים רק אחרי בדיקה שהמשתמש רכש. (זו הגנה סבירה, לא DRM – מי שצופה
   יכול טכנית להקליט מסך.) אם יש הרבה צפיות, שקלו מעבר ל-Mux / Cloudflare Stream (HLS, חיסכון בתעבורה).

## 5. פריסה ל-Vercel

1. דוחפים את הקוד ל-GitHub.
2. ב-[vercel.com](https://vercel.com) → **Add New → Project** → בוחרים את הריפו (Framework: Next.js, ללא שינויים).
3. **Settings → Environment Variables**: מוסיפים את כל המשתנים מהטבלה (Production, ואם רוצים גם Preview).
4. Deploy.
5. **Settings → Domains**: מחברים דומיין, ומעדכנים את `NEXT_PUBLIC_SITE_URL`, את URL-ים ב-Supabase ואת
   ה-webhook ב-Stripe לדומיין הסופי → Redeploy.
6. בדיקה מקצה לקצה במצב test: הרשמה → אישור אימייל → רכישה בכרטיס בדיקה → גישה לקורס → קבלה באזור האישי →
   Refund ב-Stripe → הגישה נחסמת.
7. מעבר לייצור: מחליפים למפתחות Live של Stripe, יוצרים webhook חדש במצב Live, ומעדכנים את `STRIPE_WEBHOOK_SECRET`.

## ✅ רשימה למילוי ולבדיקה בעצמך

**למלא ב-`config/site.ts`**
- [ ] פרטי העסק: שם, סוג עוסק, מספר עוסק/ח.פ, כתובת, טלפון, אימייל, שעות מענה
- [ ] רכז/ת נגישות: שם, טלפון, אימייל, תאריך עדכון ההצהרה
- [ ] `launchEndsAt` – תאריך סיום אמיתי למחיר ההשקה
- [ ] `vatNote` – עוסק פטור? (אז "העסק פטור ממע"מ" במקום "כולל מע"מ")
- [ ] `access` – תקופת הגישה (כרגע 12 חודשים) – להחליט
- [ ] שמות, תיאורים ומשכים של 10 השיעורים; רשימת "מה מקבלים"; FAQ
- [ ] המלצות – רק אמיתיות, עם אישור בכתב מהכותבים

**לבדוק עם עורך דין** (חפשו `TODO` בעמודים – מסומן בצהוב באתר)
- [ ] תקנון – כולל סמכות שיפוט ומה קורה אם הקורס יורד מהאוויר
- [ ] מדיניות ביטול – **לבחור** את המדיניות לגבי תוכן שכבר נצפה (חלופות א/ב/ג) ולוודא תחולת סעיף 14ג(ד)
- [ ] מדיניות פרטיות – רישום מאגר / ממונה הגנת פרטיות לפי תיקון 13, אזור שרתי Supabase, ספק החשבוניות
- [ ] הצהרת נגישות – מומלץ בדיקה של מורשה/יועץ נגישות, ולעדכן את רמת העמידה בפועל
- [ ] תוכן השיווק בדף הנחיתה (כותרת, הבטחות) – שאינו מטעה לפי חוק הגנת הצרכן
- [ ] אחרי האישור: לעדכן את `legalVersion` ולהסיר את `<DraftBanner />` מהעמודים

**טכני / תפעולי**
- [ ] להריץ את ה-SQL ב-Supabase ולהגדיר Redirect URLs
- [ ] תבניות אימייל בעברית + SMTP משלכם
- [ ] Stripe: אימות עסק, webhook, בדיקה מלאה במצב test, מעבר ל-Live
- [ ] חשבוניות: Morning sandbox → ייצור (או ספק אחר)
- [ ] להעלות סרטונים **וכתוביות** לכל 10 השיעורים
- [ ] לוגו / favicon / תמונת OG (אם מוסיפים תמונות – לתת להן `alt`)
- [ ] אם מוסיפים Google Analytics / Meta Pixel – לטעון רק אחרי `hasConsent(...)` מ-`lib/consent.ts`
- [ ] לנהל בקשות ביטול: טבלת `cancellation_requests` + Refund ב-Stripe תוך 14 יום
