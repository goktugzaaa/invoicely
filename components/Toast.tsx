"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import type { Dict } from "@/lib/i18n/dict";

type ToastKey = keyof Dict["toast"];

const VALID_KEYS: ToastKey[] = [
  "invoiceCreated",
  "invoiceUpdated",
  "invoiceDeleted",
  "invoicePaid",
  "invoiceSent",
  "clientCreated",
  "clientUpdated",
  "clientDeleted",
  "profileSaved",
  "logoUpdated",
  "emailConfirmed",
  "passwordReset",
  "confirmFail",
];

function FlashInner() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const flash = sp.get("flash");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!flash || !VALID_KEYS.includes(flash as ToastKey)) {
      setVisible(false);
      return;
    }
    setMessage(t.toast[flash as ToastKey]);
    setVisible(true);

    // Scrub flash from URL
    const params = new URLSearchParams(sp.toString());
    params.delete("flash");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });

    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash]);

  if (!visible || !message) return null;

  const isError = flash === "confirmFail";
  const borderColor = isError ? "border-rose-200 ring-rose-100" : "border-emerald-200 ring-emerald-100";
  const iconBg = isError ? "bg-rose-500" : "bg-emerald-500";
  const iconPath = isError ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className={`pointer-events-auto flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ring-1 animate-fade-in-down ${borderColor}`}>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </span>
        <p className="text-sm font-medium text-slate-900">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function FlashToast() {
  return (
    <Suspense fallback={null}>
      <FlashInner />
    </Suspense>
  );
}
