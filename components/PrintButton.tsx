"use client";

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
      הדפסה / שמירה כ-PDF
    </button>
  );
}
