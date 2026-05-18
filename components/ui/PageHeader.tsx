import * as React from "react";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
      <div>
        {eyebrow && (
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            — {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl dark:text-slate-100">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
