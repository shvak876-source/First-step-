import "server-only";

/**
 * הפקת קבלה / חשבונית מס-קבלה אחרי תשלום.
 *
 * בישראל קבלת Stripe אינה מסמך חשבונאי תקף – צריך להפיק קבלה/חשבונית
 * ממערכת הנהלת חשבונות ישראלית. כאן יש חיבור ל-Morning (חשבונית ירוקה).
 * כדי להשתמש בשירות אחר (iCount, EZcount, Rivhit וכו') – מממשים פונקציה
 * באותה חתימה ומוסיפים אותה ל-switch.
 *
 * ⚠ את מבנה הבקשה יש לאמת מול התיעוד העדכני של הספק ובסביבת sandbox לפני ייצור.
 */

export type InvoiceInput = {
  amountIls: number;
  customerName: string;
  customerEmail: string;
  description: string;
  paidAt: Date;
  /** מזהה חיצוני לשמירה על אידמפוטנטיות/מעקב */
  externalId: string;
};

export type InvoiceResult = { number: string; url: string } | null;

export async function createInvoice(input: InvoiceInput): Promise<InvoiceResult> {
  const provider = process.env.INVOICE_PROVIDER || "none";
  switch (provider) {
    case "greeninvoice":
      return createGreenInvoice(input);
    case "none":
      return null;
    default:
      console.warn(`[invoice] unknown INVOICE_PROVIDER "${provider}" – skipping`);
      return null;
  }
}

async function createGreenInvoice(input: InvoiceInput): Promise<InvoiceResult> {
  const base = (process.env.GREENINVOICE_API_URL || "https://sandbox.d.greeninvoice.co.il/api/v1").replace(/\/$/, "");
  const id = process.env.GREENINVOICE_API_KEY_ID;
  const secret = process.env.GREENINVOICE_API_KEY_SECRET;
  if (!id || !secret) {
    console.warn("[invoice] GREENINVOICE credentials missing – skipping");
    return null;
  }

  const tokenRes = await fetch(`${base}/account/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, secret }),
  });
  if (!tokenRes.ok) throw new Error(`greeninvoice token failed: ${tokenRes.status}`);
  const { token } = (await tokenRes.json()) as { token: string };

  const date = input.paidAt.toISOString().slice(0, 10);
  const docRes = await fetch(`${base}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      // 320 = חשבונית מס/קבלה, 400 = קבלה (לעוסק פטור)
      type: Number(process.env.GREENINVOICE_DOCUMENT_TYPE || 320),
      description: input.description,
      lang: "he",
      currency: "ILS",
      // 0 = המחיר כולל מע"מ (ככל שחל)
      vatType: 0,
      remarks: `מזהה הזמנה: ${input.externalId}`,
      client: {
        name: input.customerName || input.customerEmail,
        emails: [input.customerEmail],
        add: true,
      },
      income: [
        {
          description: input.description,
          quantity: 1,
          price: input.amountIls,
          currency: "ILS",
          // 1 = המחיר כולל מע"מ
          vatType: 1,
        },
      ],
      payment: [
        {
          date,
          // 3 = כרטיס אשראי
          type: 3,
          price: input.amountIls,
          currency: "ILS",
        },
      ],
    }),
  });
  if (!docRes.ok) {
    throw new Error(`greeninvoice document failed: ${docRes.status} ${await docRes.text()}`);
  }
  const doc = (await docRes.json()) as { number?: number | string; url?: { he?: string; origin?: string } };
  return {
    number: String(doc.number ?? ""),
    url: doc.url?.he || doc.url?.origin || "",
  };
}

