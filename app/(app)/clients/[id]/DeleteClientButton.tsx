"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteClientAction } from "../actions";
import { useT } from "@/lib/i18n/context";

export function DeleteClientButton({ id }: { id: string }) {
  const t = useT();
  const [pending, start] = useTransition();
  return (
    <Button
      variant="danger"
      loading={pending}
      onClick={() => {
        if (!confirm(t.clients.deleteConfirm)) return;
        start(async () => {
          const r = await deleteClientAction(id);
          if (r && "error" in r) alert(r.error);
        });
      }}
    >
      {t.common.delete}
    </Button>
  );
}
