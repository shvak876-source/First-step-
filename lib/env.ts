/** קריאת משתני סביבה עם שגיאה ברורה אם משהו חסר. */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const videoBucket = () => process.env.SUPABASE_VIDEO_BUCKET || "course-videos";
