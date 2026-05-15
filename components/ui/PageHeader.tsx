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
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            {eyebrow}
          </p>
        )}
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-900">
          <span aria-hidden className="h-5 w-1 rounded-full bg-brand-gradient" />
          {title}
        </h1>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
