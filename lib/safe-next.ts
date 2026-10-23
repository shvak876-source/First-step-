/** מונע open-redirect: מאפשר רק נתיבים פנימיים. */
export function safeNext(next: unknown, fallback = "/course"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
