"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function AutoPdfInner({ id }: { id: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (sp.get("openPdf") !== "1") return;
    fired.current = true;
    window.open(`/api/invoices/${id}/pdf`, "_blank", "noopener,noreferrer");
    const params = new URLSearchParams(sp.toString());
    params.delete("openPdf");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [sp, id, router, pathname]);

  return null;
}

export function AutoPdf({ id }: { id: string }) {
  return (
    <Suspense fallback={null}>
      <AutoPdfInner id={id} />
    </Suspense>
  );
}
