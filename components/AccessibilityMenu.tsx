"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { A11Y_KEY as KEY } from "@/lib/a11y";

type Prefs = { text: 0 | 1 | 2; contrast: boolean; links: boolean; readable: boolean; noMotion: boolean };
const DEFAULT: Prefs = { text: 0, contrast: false, links: false, readable: false, noMotion: false };

/** מחיל את ההעדפות על <html>. אותה לוגיקה רצה גם בסקריפט המוקדם ב-layout. */
function apply(p: Prefs) {
  const c = document.documentElement.classList;
  c.toggle("a11y-text-lg", p.text === 1);
  c.toggle("a11y-text-xl", p.text === 2);
  c.toggle("a11y-contrast", p.contrast);
  c.toggle("a11y-links", p.links);
  c.toggle("a11y-readable", p.readable);
  c.toggle("a11y-no-motion", p.noMotion);
}


export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) setPrefs({ ...DEFAULT, ...saved });
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const update = (next: Prefs) => {
    setPrefs(next);
    apply(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = (k: Exclude<keyof Prefs, "text">) => update({ ...prefs, [k]: !prefs[k] });

  const textLabel = ["רגיל", "גדול", "גדול מאוד"][prefs.text];

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="a11y-toggle"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 8.5c0 .6-.4 1-1 1.1l-4 .6V14l1.9 6.2a1 1 0 0 1-1.9.6L12.3 15h-.6L10 20.8a1 1 0 0 1-1.9-.6L10 14v-3.8l-4-.6a1 1 0 0 1 .3-2l5.7.8 5.7-.8c.7-.1 1.3.4 1.3 1z" />
        </svg>
      </button>
      {open && (
        <div id="a11y-panel" ref={panelRef} className="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title">
          <h2 id="a11y-title">נגישות</h2>
          <div className="opts">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ ...prefs, text: ((prefs.text + 1) % 3) as Prefs["text"] })}>
              גודל טקסט: {textLabel}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" aria-pressed={prefs.contrast} onClick={() => toggle("contrast")}>
              ניגודיות גבוהה
            </button>
            <button type="button" className="btn btn-ghost btn-sm" aria-pressed={prefs.links} onClick={() => toggle("links")}>
              הדגשת קישורים
            </button>
            <button type="button" className="btn btn-ghost btn-sm" aria-pressed={prefs.readable} onClick={() => toggle("readable")}>
              גופן קריא
            </button>
            <button type="button" className="btn btn-ghost btn-sm" aria-pressed={prefs.noMotion} onClick={() => toggle("noMotion")}>
              עצירת אנימציות
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => update(DEFAULT)}>
              איפוס הגדרות
            </button>
            <Link href="/accessibility" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
