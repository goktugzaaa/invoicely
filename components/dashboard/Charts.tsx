"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint, StatusPoint } from "@/services/dashboard";
import { formatCurrency } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import type { InvoiceStatus } from "@/types/db";

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  paid: "#10b981",
  overdue: "#f43f5e",
};

export function RevenueBar({
  data,
  currency,
}: {
  data: MonthlyPoint[];
  currency: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <Tooltip
            cursor={{ fill: "rgba(31, 61, 245, 0.05)" }}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
            formatter={(v) => formatCurrency(Number(v), currency)}
          />
          <Bar dataKey="revenue" fill="#1f3df5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusList({ data, currency }: { data: StatusPoint[]; currency: string }) {
  const t = useT();
  const totalCount = data.reduce((s, d) => s + d.count, 0);
  const totalAmount = data.reduce((s, d) => s + d.amount, 0);

  if (totalCount === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-500">
        {t.dashboard.noInvoices}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{totalCount}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{t.invoices.title}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-700">{formatCurrency(totalAmount, currency)}</div>
          <div className="text-xs text-slate-500">{t.common.total.toLowerCase()}</div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((d) => {
          const pct = totalCount > 0 ? (d.count / totalCount) * 100 : 0;
          const color = STATUS_COLORS[d.status] ?? "#64748b";
          return (
            <div key={d.status}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {t.status[d.status as InvoiceStatus]}
                </span>
                <span className="tabular-nums text-slate-500">
                  <span className="font-medium text-slate-700">{d.count}</span>
                  <span className="mx-1.5 text-slate-300">·</span>
                  {formatCurrency(d.amount, currency)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
