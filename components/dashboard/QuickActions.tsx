"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export function QuickActions() {
  const t = useT();
  const items = [
    {
      href: "/invoices/new",
      title: t.dashboard.qaInvoice,
      sub: t.dashboard.qaInvoiceSub,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      tone: "bg-brand-50 text-brand-700",
    },
    {
      href: "/clients/new",
      title: t.dashboard.qaClient,
      sub: t.dashboard.qaClientSub,
      icon: "M16 14a4 4 0 10-8 0M12 14v6m-7 0h14",
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      href: "/settings",
      title: t.dashboard.qaSettings,
      sub: t.dashboard.qaSettingsSub,
      icon: "M4 16v-2a4 4 0 014-4h8a4 4 0 014 4v2M12 12a4 4 0 110-8 4 4 0 010 8z",
      tone: "bg-amber-50 text-amber-700",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${it.tone}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={it.icon} />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-900 group-hover:text-brand-700">
              {it.title}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">{it.sub}</span>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-2 h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
