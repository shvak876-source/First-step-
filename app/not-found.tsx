import Link from "next/link";

export default function NotFound() {
  return (
    <div className="auth-wrap" style={{ textAlign: "center" }}>
      <p className="stamp">404</p>
      <h1 style={{ fontSize: "2rem" }}>התיק הזה לא קיים</h1>
      <Link href="/" className="btn btn-primary">חזרה לדף הבית</Link>
    </div>
  );
}
