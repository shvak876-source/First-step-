import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusinessDetails from "@/components/BusinessDetails";
import PrintButton from "@/components/PrintButton";
import { getPurchases } from "@/lib/access";
import { getUser } from "@/lib/supabase/server";
import { access, formatDateHe, site } from "@/config/site";

export const metadata: Metadata = { title: "פרטי עסקה", robots: { index: false } };
export const dynamic = "force-dynamic";

/** מסמך פרטי העסקה (גילוי לפי סעיף 14ג לחוק הגנת הצרכן). אינו חשבונית מס/קבלה. */
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  const purchase = (await getPurchases()).find((p) => p.id === id);
  if (!user || !purchase) notFound();

  return (
    <div className="prose">
      <h1>פרטי עסקה</h1>
      <p className="fineprint">מסמך זה מפרט את תנאי העסקה ואינו מהווה חשבונית מס או קבלה.</p>
      <h2>העוסק</h2>
      <BusinessDetails />
      <h2>העסקה</h2>
      <table className="data">
        <tbody>
          <tr><th scope="row">מספר הזמנה</th><td dir="ltr" style={{ textAlign: "end" }}>{purchase.id.slice(0, 8).toUpperCase()}</td></tr>
          <tr><th scope="row">תאריך</th><td>{formatDateHe(purchase.created_at)}</td></tr>
          <tr><th scope="row">לקוח</th><td dir="ltr" style={{ textAlign: "end" }}>{user.email}</td></tr>
          <tr><th scope="row">המוצר</th><td>קורס וידאו &quot;{site.name}&quot; – 10 שיעורים</td></tr>
          <tr><th scope="row">גישה</th><td>{access.description}</td></tr>
          <tr><th scope="row">סכום ששולם</th><td>{(purchase.amount_agorot / 100).toLocaleString("he-IL")} ₪ (כולל מע&quot;מ ככל שחל)</td></tr>
          <tr><th scope="row">אמצעי תשלום</th><td>כרטיס אשראי / ארנק דיגיטלי דרך ספק הסליקה</td></tr>
          <tr><th scope="row">סטטוס</th><td>{purchase.status === "paid" ? "שולם" : "בוטל והוחזר"}</td></tr>
          <tr><th scope="row">גרסת התקנון שאושרה</th><td>{purchase.terms_version}</td></tr>
        </tbody>
      </table>
      <h2>ביטול עסקה</h2>
      <p>
        ניתן לבטל את העסקה בהתאם ל<a href="/cancellation">מדיניות הביטול</a>: דרך האזור האישי, באימייל או
        בטלפון המופיעים למעלה.
      </p>
      <PrintButton />
    </div>
  );
}
