import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import LessonPlayer from "./LessonPlayer";
import { hasCourseAccess } from "@/lib/access";
import { getCompletedSlugs, getSignedMedia, progressPercent, recordView } from "@/lib/course";
import { getUser } from "@/lib/supabase/server";
import { lessons } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  return { title: lesson ? `שיעור ${lesson.number}: ${lesson.title}` : "שיעור" };
}

export default async function LessonPage({ params }: Params) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();

  // בדיקת הרשאה גם כאן (לא רק ב-layout) – לפני יצירת קישורים חתומים
  const user = await getUser();
  if (!user) redirect(`/login?next=/course/${slug}`);
  if (!(await hasCourseAccess())) redirect("/course");

  const [done, media] = await Promise.all([getCompletedSlugs(), getSignedMedia(lesson)]);
  await recordView(user.id, slug);
  const percent = progressPercent(done);
  const idx = lessons.indexOf(lesson);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <div className="course-layout">
      <section aria-labelledby="lesson-title">
        <p className="eyebrow">שיעור {String(lesson.number).padStart(2, "0")} מתוך {lessons.length}</p>
        <h1 id="lesson-title" style={{ fontSize: "clamp(1.7rem, 6vw, 2.6rem)" }}>{lesson.title}</h1>
        <LessonPlayer
          slug={lesson.slug}
          title={lesson.title}
          videoUrl={media.videoUrl}
          captionsUrl={media.captionsUrl}
          completed={done.has(lesson.slug)}
        />
        <p className="muted" style={{ marginTop: 18 }}>{lesson.summary}</p>
        <nav aria-label="ניווט בין שיעורים" style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
          {prev ? <Link href={`/course/${prev.slug}`} className="btn btn-ghost btn-sm">→ הקודם</Link> : <span />}
          {next ? <Link href={`/course/${next.slug}`} className="btn btn-ghost btn-sm">הבא ←</Link> : <span />}
        </nav>
      </section>

      <aside className="card" aria-labelledby="toc-title">
        <h2 id="toc-title" style={{ fontSize: "1.2rem" }}>השיעורים</h2>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
            <span>ההתקדמות שלך</span>
            <strong className="glow-gold">{percent}%</strong>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="התקדמות בקורס"
          >
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
        <ol className="lesson-nav">
          {lessons.map((l) => (
            <li key={l.slug}>
              <Link href={`/course/${l.slug}`} aria-current={l.slug === slug ? "page" : undefined}>
                <span className="n" aria-hidden="true">{String(l.number).padStart(2, "0")}</span>
                <span>
                  <span className="sr-only">שיעור {l.number}: </span>
                  {l.title}
                </span>
                {done.has(l.slug) ? (
                  <span className="done">
                    <span aria-hidden="true">✓</span>
                    <span className="sr-only">(נצפה)</span>
                  </span>
                ) : (
                  <span />
                )}
              </Link>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
