"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { deleteInvoiceAction, setInvoiceStatusAction } from "../actions";
import { useT } from "@/lib/i18n/context";
import type { InvoiceStatus } from "@/types/db";

export function InvoiceActions({ id, status }: { id: string; status: InvoiceStatus }) {
  const t = useT();
  const router = useRouter();
  const [pending, start] = useTransition();

  function setStatus(next: InvoiceStatus) {
    start(async () => {
      const r = await setInvoiceStatusAction(id, next);
      if (r && "error" in r) {
        alert(r.error);
        return;
      }
      const flash = next === "paid" ? "invoicePaid" : next === "sent" ? "invoiceSent" : "invoiceUpdated";
      router.push(`/invoices/${id}?flash=${flash}`);
    });
  }

  function onDelete() {
    if (!confirm(t.invoices.deleteConfirm)) return;
    start(async () => {
      const r = await deleteInvoiceAction(id);
      if (r && "error" in r) alert(r.error);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "paid" && (
        <Button variant="secondary" loading={pending} onClick={() => setStatus("paid")}>
          {t.invoices.markPaid}
        </Button>
      )}
      {status === "draft" && (
        <Button variant="outline" loading={pending} onClick={() => setStatus("sent")}>
          {t.invoices.markSent}
        </Button>
      )}
      <Button variant="danger" loading={pending} onClick={onDelete}>
        {t.common.delete}
      </Button>
    </div>
  );
}
