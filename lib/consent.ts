"use client";

/**
 * הסכמה לעוגיות. האתר כרגע משתמש רק בעוגיות הכרחיות (התחברות, הגדרת הסכמה,
 * העדפות נגישות). אם תוסיפו בעתיד אנליטיקס/פיקסל – טענו אותם רק כאשר
 * hasConsent("analytics") / hasConsent("marketing") מחזירים true.
 */
export type Consent = { essential: true; analytics: boolean; marketing: boolean; at: string };

const COOKIE = "cookie_consent";
export const CONSENT_EVENT = "cookie-consent-change";
export const OPEN_SETTINGS_EVENT = "cookie-consent-open";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(COOKIE + "="));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(c: Omit<Consent, "essential" | "at">) {
  const value: Consent = { essential: true, ...c, at: new Date().toISOString() };
  const maxAge = 60 * 60 * 24 * 180; // חצי שנה
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function hasConsent(kind: "analytics" | "marketing"): boolean {
  return Boolean(readConsent()?.[kind]);
}
