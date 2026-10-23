"use client";

import { useTransition } from "react";
import { setLessonComplete } from "../actions";

type Props = {
  slug: string;
  title: string;
  videoUrl: string | null;
  captionsUrl: string | null;
  completed: boolean;
};

export default function LessonPlayer({ slug, title, videoUrl, captionsUrl, completed }: Props) {
  const [pending, start] = useTransition();
  const mark = (v: boolean) => start(() => setLessonComplete(slug, v));

  return (
    <div>
      <div className="player-wrap">
        {videoUrl ? (
          <video
            key={slug}
            controls
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            onEnded={() => !completed && mark(true)}
            aria-label={`סרטון: ${title}`}
          >
            <source src={videoUrl} type="video/mp4" />
            {captionsUrl && <track kind="captions" src={captionsUrl} srcLang="he" label="עברית" default />}
            הדפדפן שלך אינו תומך בניגון וידאו.
          </video>
        ) : (
          <div style={{ aspectRatio: "16 / 9", display: "grid", placeItems: "center", padding: 20, textAlign: "center" }}>
            <p className="muted" style={{ margin: 0 }}>הסרטון של השיעור הזה יעלה בקרוב.</p>
          </div>
        )}
      </div>
      {videoUrl && !captionsUrl && (
        <p className="fineprint" style={{ marginTop: 8 }}>כתוביות לשיעור זה יתווספו בקרוב.</p>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
        <button
          type="button"
          className={completed ? "btn btn-ghost" : "btn btn-primary"}
          aria-pressed={completed}
          disabled={pending}
          onClick={() => mark(!completed)}
        >
          {completed ? "✓ צפיתי (לחץ לביטול)" : "סמן כ״צפיתי״"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {completed ? "השיעור סומן כנצפה" : ""}
        </span>
      </div>
    </div>
  );
}
