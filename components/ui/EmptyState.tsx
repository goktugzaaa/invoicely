import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "clients" | "invoices" | "generic";

const ART: Record<Variant, { tone: string; svg: React.ReactNode }> = {
  clients: {
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
  invoices: {
    tone: "bg-brand-50 text-brand-600 ring-brand-100",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  generic: {
    tone: "bg-slate-100 text-slate-500 ring-slate-200",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
};

export function EmptyState({
  title,
  description,
  action,
  variant = "generic",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: Variant;
}) {
  const art = ART[variant];
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      {/* soft background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className={cn(
          "relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ring-8",
          art.tone
        )}
      >
        {art.svg}
      </div>
      <h3 className="relative text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="relative mt-1 max-w-md text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
