"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SUPPORTED_CURRENCIES } from "@/lib/utils";
import { saveProfileAction } from "./actions";
import { useT } from "@/lib/i18n/context";
import type { Profile } from "@/types/db";

export function SettingsForm({ initial }: { initial: Profile | null }) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const r = await saveProfileAction(formData);
      if (r.ok) router.push("/settings?flash=profileSaved");
      else setError(r.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label={t.settings.businessName} name="business_name" defaultValue={initial?.business_name ?? ""} />
        <Input label={t.settings.taxId} name="tax_id" defaultValue={initial?.tax_id ?? ""} />
        <Input label={t.common.email} type="email" name="email" defaultValue={initial?.email ?? ""} />
        <Input label={t.common.phone} name="phone" defaultValue={initial?.phone ?? ""} />
        <Select
          label={t.settings.defaultCurrency}
          name="default_currency"
          defaultValue={initial?.default_currency ?? "USD"}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <Textarea label={t.common.address} name="address" rows={3} defaultValue={initial?.address ?? ""} />
      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {t.common.save}
        </Button>
      </div>
    </form>
  );
}
