import "server-only";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { videoBucket } from "@/lib/env";
import { lessons, type Lesson } from "@/config/site";

const SIGNED_URL_TTL = 60 * 60 * 3; // 3 שעות

export async function getCompletedSlugs(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("lesson_progress").select("lesson_slug");
  return new Set((data ?? []).map((r) => r.lesson_slug as string));
}

export function progressPercent(done: Set<string>): number {
  const n = lessons.filter((l) => done.has(l.slug)).length;
  return Math.round((n / lessons.length) * 100);
}

/** קישורים חתומים לסרטון ולכתוביות. לקרוא רק אחרי בדיקת הרשאה! */
export async function getSignedMedia(lesson: Lesson) {
  const storage = createServiceClient().storage.from(videoBucket());
  const [video, captions] = await Promise.all([
    storage.createSignedUrl(lesson.videoPath, SIGNED_URL_TTL),
    storage.createSignedUrl(lesson.captionsPath, SIGNED_URL_TTL),
  ]);
  return {
    videoUrl: video.data?.signedUrl ?? null,
    captionsUrl: captions.data?.signedUrl ?? null,
  };
}

export async function recordView(userId: string, slug: string) {
  const supabase = await createClient();
  await supabase
    .from("lesson_views")
    .upsert({ user_id: userId, lesson_slug: slug }, { onConflict: "user_id,lesson_slug", ignoreDuplicates: true });
}
