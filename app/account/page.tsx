import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import CancelForm from "./CancelForm";
import FormAlert from "@/components/FormAlert";
import { createClient, getUser } from "@/lib/supabase/server";
import { accessExpiresAt, getPurchases, isPurchaseActive } from "@/lib/access";
import { business, formatDateHe } from "@/config/site";

export const metadata: Metadata = { title: "אזור אישי", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const sp = await searchParams;
  const supabase = await createClient();
  const [{ data: profile }, purchases, { data: cancels }] = await Promise.all([
    supabase.from("profiles").select("full_name, marketing_opt_in, created_at").eq("id", user.id).maybeSingle(),
    getPurchases(),
    supabase.from("cancellation_requests").select("purchase_id, status, created_at"),
  ]);
  const cancelByPurchase = new Map((cancels ?? []).map((c) => [c.purchase_id as string, c]));

  return (
    <div className="container" style={{ maxWidth: 860, padding: "40px 16px 80px" }}>
      <p className="eyebrow">התיק שלך</p>
      <h1 style={{ fontSize: "2.4rem" }}>אזור אישי</h1>
      {sp.updated === "password" && <FormAlert message="הסיסמה עודכנה." />}

      <div className="grid" style={{ gap: 20 }}>
        <section className="card" aria-labelledby="details-title">
          <h2 id="details-title" style={{ fontSize: "1.4rem" }}>הפרטים שלי</h2>
          <p>
            <span className="muted">אימייל: </span>
            <span dir="ltr">{user.email}</span>
          </p>
          <ProfileForm fullName={profile?.full_name ?? ""} marketing={Boolean(profile?.marketing_opt_in)} />
          <p className="fineprint" style={{ marginTop: 14 }}>
            <Link href="/forgot-password">שינוי סיסמה</Link>
          </p>
        </section>

        <section className="card" aria-labelledby="purchases-title">
          <h2 id="purchases-title" style={{ fontSize: "1.4rem" }}>היסטוריית רכישות</h2>
          {purchases.length === 0 ? (
            <p className="muted">
              עדיין אין רכישות. <Link href="/checkout">לרכישת הקורס</Link>
            </p>
          ) : (
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">תאריך</th>
                    <th scope="col">סכום</th>
                    <th scope="col">סטטוס</th>
                    <th scope="col">מסמכים</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => {
                    const exp = accessExpiresAt(p);
                    const cancel = cancelByPurchase.get(p.id);
                    return (
                      <tr key={p.id}>
                        <td>{formatDateHe(p.created_at)}</td>
                        <td>{(p.amount_agorot / 100).toLocaleString("he-IL")} ₪</td>
                        <td>
                          {p.status === "refunded"
                            ? "בוטלה – הוחזר"
                            : isPurchaseActive(p)
                              ? `פעיל${exp ? ` עד ${formatDateHe(exp)}` : ""}`
                              : "הגישה הסתיימה"}
                          {cancel && p.status !== "refunded" && (
                            <div className="fineprint">בקשת ביטול: {cancel.status === "pending" ? "בטיפול" : cancel.status}</div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "grid", gap: 4 }}>
                            {p.invoice_url && (
                              <a href={p.invoice_url} target="_blank" rel="noopener noreferrer">
                                קבלה / חשבונית {p.invoice_number ? `#${p.invoice_number}` : ""}
                              </a>
                            )}
                            {p.receipt_url && (
                              <a href={p.receipt_url} target="_blank" rel="noopener noreferrer">אישור תשלום</a>
                            )}
                            <Link href={`/account/orders/${p.id}`}>פרטי העסקה</Link>
                            {!p.invoice_url && (
                              <span className="fineprint">הקבלה תישלח לאימייל שלך</span>
                            )}
                            {p.status === "paid" && !cancel && <CancelForm purchaseId={p.id} />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card" aria-labelledby="privacy-title">
          <h2 id="privacy-title" style={{ fontSize: "1.4rem" }}>פרטיות</h2>
          <p className="muted">
            לבקשת עיון במידע, תיקון או מחיקת החשבון והמידע שלך, פנה/י אלינו בכתובת{" "}
            <a href={`mailto:${business.email}?subject=${encodeURIComponent("בקשה בנושא פרטיות")}`}>{business.email}</a>.
            פרטים נוספים ב<Link href="/privacy">מדיניות הפרטיות</Link>.
          </p>
          <form action="/auth/signout" method="post">
            <button className="btn btn-ghost">התנתקות</button>
          </form>
        </section>
      </div>
    </div>
  );
}
