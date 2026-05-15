"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  query,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  query: Record<string, string | undefined>;
}) {
  const t = useT();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function build(p: number) {
    const sp = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && k !== "page") sp.set(k, v);
    });
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  }

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
      <span className="text-slate-500">
        {t.common.page} {page} {t.common.of} {totalPages} · {total} {t.common.total.toLowerCase()}
      </span>
      <div className="flex gap-1">
        <PageLink href={build(prev)} disabled={page === 1}>
          {t.common.prev}
        </PageLink>
        <PageLink href={build(next)} disabled={page === totalPages}>
          {t.common.next}
        </PageLink>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      )}
    >
      {children}
    </Link>
  );
}
