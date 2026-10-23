import { redirect } from "next/navigation";
import { getCompletedSlugs } from "@/lib/course";
import { lessons } from "@/config/site";

/** ממשיכים מהשיעור הראשון שלא סומן כנצפה. */
export default async function CourseIndex() {
  const done = await getCompletedSlugs();
  const next = lessons.find((l) => !done.has(l.slug)) ?? lessons[0];
  redirect(`/course/${next.slug}`);
}
