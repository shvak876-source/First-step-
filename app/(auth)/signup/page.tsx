import type { Metadata } from "next";
import SignupForm from "./SignupForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "הרשמה" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="auth-wrap">
      <p className="eyebrow">פתיחת תיק</p>
      <h1 style={{ fontSize: "2.2rem" }}>הרשמה</h1>
      <SignupForm next={safeNext(sp.next, "/checkout")} />
    </div>
  );
}
