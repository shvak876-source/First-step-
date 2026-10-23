import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import PriceTag from "@/components/PriceTag";
import { hasCourseAccess } from "@/lib/access";
import { access, pricing, site } from "@/config/site";

export const metadata: Metadata = { title: "רכישה" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (await hasCourseAccess()) redirect("/course");
  const sp = await searchParams;
  return (
    <div className="auth-wrap" style={{ maxWidth: 520 }}>
      <p className="eyebrow">שלב אחרון</p>
      <h1 style={{ fontSize: "2.2rem" }}>רכישת הקורס</h1>
      <div className="card card-accent" style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.4rem" }}>קורס {site.name}</h2>
        <p className="muted" style={{ marginBottom: 8 }}>10 שיעורי וידאו · {access.description}</p>
        <PriceTag />
        <p className="fineprint" style={{ margin: 0 }}>{pricing.vatNote} תשלום חד-פעמי.</p>
      </div>
      <CheckoutForm canceled={sp.canceled === "1"} />
    </div>
  );
}
