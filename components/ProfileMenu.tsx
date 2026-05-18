"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function ProfileMenu({ email, businessName }: { email: string; businessName?: string | null }) {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (businessName || email || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-brand-sm transition-transform hover:scale-105",
          open && "ring-2 ring-brand-300 ring-offset-2"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl animate-fade-in-down dark:border-white/15 dark:bg-white/[0.04]"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t.nav.account}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {businessName || email.split("@")[0]}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
          </div>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.06]"
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400 dark:text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1 1 0 011.35 0l1.05.95a1 1 0 00.93.235l1.385-.39a1 1 0 011.226.79l.247 1.43a1 1 0 00.555.74l1.302.626a1 1 0 01.515 1.296l-.555 1.32a1 1 0 000 .773l.555 1.32a1 1 0 01-.515 1.296l-1.302.626a1 1 0 00-.555.74l-.247 1.43a1 1 0 01-1.226.79l-1.385-.39a1 1 0 00-.93.235l-1.05.95a1 1 0 01-1.35 0l-1.05-.95a1 1 0 00-.93-.235l-1.385.39a1 1 0 01-1.226-.79l-.247-1.43a1 1 0 00-.555-.74l-1.302-.626a1 1 0 01-.515-1.296l.555-1.32a1 1 0 000-.773l-.555-1.32a1 1 0 01.515-1.296l1.302-.626a1 1 0 00.555-.74l.247-1.43a1 1 0 011.226-.79l1.385.39a1 1 0 00.93-.235l1.05-.95zM12 15a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            {t.nav.settings}
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            role="menuitem"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t.nav.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
