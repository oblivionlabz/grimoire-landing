"use client";

import { useEffect, useState } from "react";

type Status = { sold: number; cap: number; left: number; published: boolean };

export function FoundingBadgeLive({ fallback }: { fallback: Status }) {
  const [status, setStatus] = useState<Status>(fallback);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/founding", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Status;
        if (!cancelled) setStatus(data);
      } catch {
        /* ignore — fall back to server-rendered value */
      }
    };
    // Initial fetch on mount, then every 60s.
    tick();
    const id = setInterval(tick, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="chamfer-sm inline-flex items-center gap-3 border border-accent-dim bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.22em]">
      <span aria-hidden className="block h-2 w-2 bg-accent pulse-dot" />
      <span className="text-muted">Founding cohort</span>
      <span className="text-foreground">
        {status.left}/{status.cap} seats left @ $99
      </span>
      <span className="text-muted">→ then $149</span>
    </div>
  );
}
