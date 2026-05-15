"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export interface OnboardingProps {
  hasProfile: boolean;
  hasClient: boolean;
  hasInvoice: boolean;
}

export function Onboarding({ hasProfile, hasClient, hasInvoice }: OnboardingProps) {
  const t = useT();
  const steps = [
    { done: hasProfile, label: t.dashboard.onboardSettings, href: "/settings" },
    { done: hasClient, label: t.dashboard.onboardClient, href: "/clients/new" },
    { done: hasInvoice, label: t.dashboard.onboardInvoice, href: "/invoices/new" },
  ];
  const completed = steps.filter((s) => s.done).length;
  const pct = (completed / steps.length) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t.dashboard.onboarding}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{t.dashboard.onboardingSub}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
          {completed}/{steps.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i}>
            <Link
              href={s.href}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                s.done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold",
                  s.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
                )}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <span className={s.done ? "line-through opacity-70" : ""}>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
