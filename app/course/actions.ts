"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { hasCourseAccess } from "@/lib/access";
import { lessons } from "@/config/site";

export async function setLessonComplete(slug: string, complete: boolean) {
  const user = await getUser();
  if (!user || !lessons.some((l) => l.slug === slug)) return;
  if (!(await hasCourseAccess())) return;
  const supabase = await createClient();
  if (complete) {
    await supabase
      .from("lesson_progress")
      .upsert({ user_id: user.id, lesson_slug: slug }, { onConflict: "user_id,lesson_slug", ignoreDuplicates: true });
  } else {
    await supabase.from("lesson_progress").delete().eq("user_id", user.id).eq("lesson_slug", slug);
  }
  revalidatePath("/course", "layout");
}
