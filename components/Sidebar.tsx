"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/Logo";
import { useT } from "@/lib/i18n/context";

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();
  const items = [
    { href: "/dashboard", label: t.nav.dashboard, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
    { href: "/clients", label: t.nav.clients, icon: "M16 14a4 4 0 10-8 0M12 14v6m-7 0h14" },
    { href: "/invoices", label: t.nav.invoices, icon: "M7 4h10l3 4v12H4V8l3-4zM4 8h16M9 14h6" },
    { href: "/reports", label: t.nav.reports, icon: "M3 3v18h18M7 16V9m4 7V5m4 11v-3m4 3V11" },
    {
      href: "/settings",
      label: t.nav.settings,
      icon: "M10.325 4.317a1 1 0 011.35 0l1.05.95a1 1 0 00.93.235l1.385-.39a1 1 0 011.226.79l.247 1.43a1 1 0 00.555.74l1.302.626a1 1 0 01.515 1.296l-.555 1.32a1 1 0 000 .773l.555 1.32a1 1 0 01-.515 1.296l-1.302.626a1 1 0 00-.555.74l-.247 1.43a1 1 0 01-1.226.79l-1.385-.39a1 1 0 00-.93.235l-1.05.95a1 1 0 01-1.35 0l-1.05-.95a1 1 0 00-.93-.235l-1.385.39a1 1 0 01-1.226-.79l-.247-1.43a1 1 0 00-.555-.74l-1.302-.626a1 1 0 01-.515-1.296l.555-1.32a1 1 0 000-.773l-.555-1.32a1 1 0 01.515-1.296l1.302-.626a1 1 0 00.555-.74l.247-1.43a1 1 0 011.226-.79l1.385.39a1 1 0 00.93-.235l1.05-.95z",
    },
  ];
  return (
    <aside className="relative hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block dark:border-white/10 dark:bg-white/[0.02] dark:backdrop-blur-xl">
      {/* brand top strip */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />
      <div className="flex h-16 items-center border-b border-slate-100 px-5 dark:border-white/10">
        <Brand size="sm" href="/dashboard" />
      </div>
      <nav className="p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950/40 dark:text-brand-300"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              {active && (
                <span aria-hidden className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
              )}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn(
                  "h-4 w-4 transition-colors",
                  active
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                )}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* footer brand mark */}
      <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 px-5 py-3 dark:border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Nib <span className="text-slate-300 dark:text-slate-700">·</span> v1.0
        </p>
      </div>
    </aside>
  );
}
