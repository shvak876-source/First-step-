import "server-only";
import { access, business, formatDateHe, site } from "@/config/site";
import { siteUrl } from "@/lib/env";

export type OrderEmailInput = {
  purchaseId: string;
  createdAt: Date;
  amountIls: number;
  customerEmail: string;
  customerName: string;
  termsVersion: string;
  invoiceUrl?: string;
  receiptUrl?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * מסמך פרטי העסקה שנשלח ללקוח באימייל אחרי התשלום
 * (חובת מסירת מסמך בעסקת מכר מרחוק – סעיף 14ג(ב) לחוק הגנת הצרכן).
 * ⚠ טיוטה – לבדיקת עו"ד.
 */
export function orderEmail(o: OrderEmailInput) {
  const orderNo = o.purchaseId.slice(0, 8).toUpperCase();
  const url = siteUrl();
  const rows: [string, string][] = [
    ["מספר הזמנה", orderNo],
    ["תאריך", formatDateHe(o.createdAt)],
    ["לקוח", `${o.customerName ? o.customerName + " · " : ""}${o.customerEmail}`],
    ["המוצר", `קורס וידאו "${site.name}" – 10 שיעורים`],
    ["תקופת גישה", access.description],
    ["סכום ששולם", `${o.amountIls.toLocaleString("he-IL")} ₪`],
    ["אמצעי תשלום", "כרטיס אשראי / ארנק דיגיטלי דרך ספק הסליקה"],
    ["גרסת התקנון שאושרה", o.termsVersion],
  ];
  const seller: [string, string][] = [
    ["שם העוסק", business.legalName],
    ["סוג ומספר עוסק", `${business.type} · ${business.registrationNumber}`],
    ["כתובת", business.address],
    ["טלפון", business.phone],
    ["אימייל", business.email],
  ];

  const table = (r: [string, string][]) =>
    `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">${r
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 0;color:#666;width:40%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;color:#111">${esc(v)}</td></tr>`,
      )
      .join("")}</table>`;

  const docs = [
    o.invoiceUrl ? `<a href="${esc(o.invoiceUrl)}">קבלה</a>` : "",
    o.receiptUrl ? `<a href="${esc(o.receiptUrl)}">אישור תשלום</a>` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const html = `<!doctype html>
<html lang="he" dir="rtl"><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
  <div style="background:#050505;color:#f5c451;padding:20px 24px;border-radius:12px 12px 0 0;font-size:22px;font-weight:bold">${esc(site.name)}</div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;line-height:1.6;color:#111">
    <h1 style="font-size:20px;margin:0 0 8px">תודה על הרכישה! פרטי העסקה שלך</h1>
    <p style="margin:0 0 16px">הגישה לקורס פתוחה. אפשר להתחיל לצפות כאן: <a href="${url}/course">${url}/course</a></p>
    ${table(rows)}
    ${docs ? `<p style="margin:16px 0 0">מסמכים: ${docs}</p>` : `<p style="margin:16px 0 0">הקבלה תישלח אליך בנפרד וזמינה גם <a href="${url}/account">באזור האישי</a>.</p>`}
    <h2 style="font-size:17px;margin:24px 0 8px">פרטי העוסק</h2>
    ${table(seller)}
    <h2 style="font-size:17px;margin:24px 0 8px">ביטול עסקה</h2>
    <p style="margin:0">ניתן לבטל את העסקה בתוך 14 ימים מיום העסקה או מקבלת מסמך זה (המאוחר מביניהם), בהתאם למדיניות הביטול ולחוק הגנת הצרכן. דמי ביטול: 5% מהמחיר או 100 ₪, הנמוך מביניהם. שימו לב: לאחר תחילת הצפייה בתוכן הדיגיטלי, זכות הביטול מוגבלת כמפורט במדיניות.
    <br>איך מבטלים: <a href="${url}/account">באזור האישי</a>, באימייל ${esc(business.email)} או בטלפון ${esc(business.phone)}.
    <br><a href="${url}/cancellation">מדיניות הביטול המלאה</a> · <a href="${url}/terms">התקנון</a></p>
  </div>
  <p style="font-size:12px;color:#777;text-align:center;margin-top:16px">מסמך זה מפרט את תנאי העסקה ואינו מהווה חשבונית מס או קבלה.</p>
</div></body></html>`;

  const text = [
    `${site.name} – פרטי העסקה שלך`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "פרטי העוסק:",
    ...seller.map(([k, v]) => `${k}: ${v}`),
    "",
    `ביטול עסקה: בתוך 14 ימים, בהתאם למדיניות הביטול: ${url}/cancellation`,
    `אזור אישי: ${url}/account`,
    o.invoiceUrl ? `קבלה: ${o.invoiceUrl}` : "",
  ].join("\n");

  return { subject: `פרטי העסקה – ${site.name} (הזמנה ${orderNo})`, html, text };
}
