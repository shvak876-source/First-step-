"use client";
import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

export default function CookieSettingsButton() {
  return (
    <button type="button" className="linklike" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      הגדרות עוגיות
    </button>
  );
}
