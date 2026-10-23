"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** ה-webhook לרוב מגיע תוך שניות. מרעננים עד 20 פעמים ואז מפסיקים. */
export default function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      if (++n > 20) return clearInterval(t);
      router.refresh();
    }, 3000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
