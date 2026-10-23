import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "כניסה" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="auth-wrap">
      <p className="eyebrow">טוב לראות אותך</p>
      <h1 style={{ fontSize: "2.2rem" }}>כניסה לחשבון</h1>
      <LoginForm next={safeNext(sp.next)} linkError={sp.error === "link"} />
    </div>
  );
}
