import "server-only";

/**
 * שליחת אימייל דרך Resend (https://resend.com).
 * אם RESEND_API_KEY או EMAIL_FROM חסרים – לא נשלח כלום (רק אזהרה בלוג).
 * כדי להשתמש בספק אחר – להחליף את גוף הפונקציה.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string; text: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY / EMAIL_FROM missing – email not sent:", opts.subject);
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
    }),
  });
  if (!res.ok) throw new Error(`resend failed: ${res.status} ${await res.text()}`);
  return true;
}
