"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeroCopy({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`hero-copy max-w-2xl${ready ? " is-ready" : ""}`}>
      {children}
    </div>
  );
}
