import type { Metadata, Viewport } from "next";
import { Heebo, Secular_One } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { a11yBootScript } from "@/lib/a11y";
import { site } from "@/config/site";
import { siteUrl } from "@/lib/env";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo", display: "swap" });
const secular = Secular_One({ subsets: ["hebrew", "latin"], weight: "400", variable: "--font-secular", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: "קורס וידאו ב-10 שיעורים לבניית ביטחון עצמי והצלחה בדייטים. לגילאי 18+.",
  openGraph: { locale: "he_IL", type: "website", siteName: site.name },
};

export const viewport: Viewport = { themeColor: "#050505", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${secular.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: a11yBootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">דלג לתוכן הראשי</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <AccessibilityMenu />
        <CookieBanner />
      </body>
    </html>
  );
}
