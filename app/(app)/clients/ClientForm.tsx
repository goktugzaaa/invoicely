"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CountrySelect, CountryWarning } from "@/components/ui/CountrySelect";
import { useT } from "@/lib/i18n/context";
import { getCountry } from "@/lib/countries";
import type { Client } from "@/types/db";

type Props = {
  initial?: Partial<Client>;
  action: (formData: FormData) => Promise<{ ok: false; error: string } | void>;
  submitLabel: string;
};

export function ClientForm({ initial, action, submitLabel }: Props) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [country, setCountry] = useState<string>(initial?.country ?? "");

  const preset = getCountry(country);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result && result.ok === false) setError(result.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label={t.common.name} name="name" defaultValue={initial?.name ?? ""} required />
        <Input label={t.common.company} name="company" defaultValue={initial?.company ?? ""} />
        <Input label={t.common.email} name="email" type="email" defaultValue={initial?.email ?? ""} />
        <Input label={t.common.phone} name="phone" defaultValue={initial?.phone ?? ""} />
        <CountrySelect
          name="country"
          label={t.fields.country}
          value={country}
          onChange={setCountry}
          hint={t.fields.countryHint}
        />
        <Input
          label={preset ? `${t.fields.vatId} (${preset.taxIdLabel})` : t.fields.vatId}
          name="vat_id"
          defaultValue={initial?.vat_id ?? ""}
        />
        <Select label={t.common.status} name="status" defaultValue={initial?.status ?? "active"}>
          <option value="active">{t.status.active}</option>
          <option value="inactive">{t.status.inactive}</option>
        </Select>
      </div>
      <Textarea label={t.fields.address} name="address" rows={3} defaultValue={initial?.address ?? ""} />
      <CountryWarning code={country} />
      <Textarea label={t.common.notes} name="notes" rows={3} defaultValue={initial?.notes ?? ""} />
      {error && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t.common.cancel}
        </Button>
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
