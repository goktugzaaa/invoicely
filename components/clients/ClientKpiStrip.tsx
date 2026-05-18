"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { formatCurrency, cn } from "@/lib/utils";
import type { ClientKpis } from "@/services/clients";

interface Cell {
  label: string;
  value: string;
  hint?: string;
  dot: string;
  glow: string;
  valueColor: string;
  ring: string;
  href?: string;
}

export function ClientKpiStrip({ kpis }: { kpis: ClientKpis }) {
  const t = useT();
  const cells: Cell[] = [
    {
      label: t.status.active,
      value: kpis.active.toString(),
      hint: t.dashboard.activeClientsHint,
      dot: "bg-emerald-500",
      glow: "dark:glow-emerald",
      valueColor: "text-emerald-700 dark:text-emerald-300",
      ring: "ring-emerald-200/60 dark:ring-emerald-900/40",
      href: "/clients?status=active",
    },
    {
      label: t.status.inactive,
      value: kpis.inactive.toString(),
      hint: "—",
      dot: "bg-slate-400 dark:bg-slate-500",
      glow: "dark:glow-slate",
      valueColor: "text-slate-900 dark:text-slate-100",
      ring: "ring-slate-200/60 dark:ring-white/10",
      href: "/clients?status=inactive",
    },
    {
      label: t.dashboard.totalRevenue,
      value: formatCurrency(kpis.totalRevenue, kpis.currency),
      hint: t.dashboard.totalRevenueHint(""),
      dot: "bg-brand-500",
      glow: "dark:glow-emerald",
      valueColor: "text-slate-900 dark:text-slate-100",
      ring: "ring-slate-200/60 dark:ring-white/10",
    },
    {
      label: t.dashboard.outstanding,
      value: formatCurrency(kpis.outstanding, kpis.currency),
      hint: "—",
      dot: "bg-rose-500",
      glow: "dark:glow-rose",
      valueColor: "text-rose-700 dark:text-rose-300",
      ring: "ring-rose-200/60 dark:ring-rose-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cells.map((c) => {
        const Wrapper: React.ElementType = c.href ? Link : "div";
        const wrapperProps = c.href ? { href: c.href } : {};
        return (
          <Wrapper
            key={c.label}
            {...wrapperProps}
            className={cn(
              "group glass relative overflow-hidden rounded-2xl p-5 ring-1 ring-inset transition-all",
              c.href && "hover:-translate-y-0.5",
              c.ring,
              c.glow
            )}
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", c.dot)} />
              {c.label}
            </div>
            <div className={cn("mt-3 text-3xl font-semibold tabular-nums tracking-[-0.025em] sm:text-4xl", c.valueColor)}>
              {c.value}
            </div>
            {c.hint && c.hint !== "—" && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.hint}</div>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}
