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
    { href: "/settings", label: t.nav.settings },
  ];
  return (
    <nav className="flex gap-1 border-b border-slate-200 bg-white px-3 py-2 md:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
