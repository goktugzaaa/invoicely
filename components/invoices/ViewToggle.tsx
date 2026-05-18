"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "table";

const ICONS: Record<ViewMode, string> = {
  grid: "M4 5h6v6H4V5zm10 0h6v6h-6V5zM4 13h6v6H4v-6zm10 0h6v6h-6v-6z",
  table: "M3 5h18M3 12h18M3 19h18",
};

export function ViewToggle({ value }: { value: ViewMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function set(next: ViewMode) {
    if (next === value || pending) return;
    const params = new URLSearchParams(sp.toString());
    if (next === "table") params.delete("view");
    else params.set("view", next);
    start(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/15 dark:bg-white/[0.04]">
      {(["grid", "table"] as ViewMode[]).map((v) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => set(v)}
            aria-label={v}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]"
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[v]} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
