"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export function MobileNav() {
  const pathname = usePathname();
  const t = useT();
  const items = [
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/clients", label: t.nav.clients },
    { href: "/invoices", label: t.nav.invoices },
    { href: "/reports", label: t.nav.reports },
    { href: "/settings", label: t.nav.settings },
  ];
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/80 px-3 py-2 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-white/[0.02]">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium",
              active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
