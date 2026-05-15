"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CountrySelect, CountryWarning } from "@/components/ui/CountrySelect";
import { SUPPORTED_CURRENCIES } from "@/lib/utils";
import { getCountry } from "@/lib/countries";
import { saveProfileAction } from "./actions";
import { useT } from "@/lib/i18n/context";
import type { Profile } from "@/types/db";

export function SettingsForm({ initial }: { initial: Profile | null }) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [country, setCountry] = useState<string>(initial?.country ?? "");
  const [currency, setCurrency] = useState<string>(initial?.default_currency ?? "USD");

  // when country changes and user hasn't manually picked currency, suggest preset
  function handleCountry(code: string) {
    setCountry(code);
    const preset = getCountry(code);
    if (preset) setCurrency(preset.currency);
  }

  function onSubmit(formData: FormData) {
    setError(null);
    start(async () => {
      const r = await saveProfileAction(formData);
      if (r.ok) router.push("/settings?flash=profileSaved");
      else setError(r.error);
    });
  }

  const preset = getCountry(country);

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Business name" name="business_name" defaultValue={initial?.business_name ?? ""} />
        <Input
          label={preset ? `Tax ID (${preset.taxIdLabel})` : "Tax ID"}
          name="tax_id"
          defaultValue={initial?.tax_id ?? ""}
        />
        <Input label={t.common.email} type="email" name="email" defaultValue={initial?.email ?? ""} />
        <Input label={t.common.phone} name="phone" defaultValue={initial?.phone ?? ""} />
        <CountrySelect
          name="country"
          label={t.fields.country}
          value={country}
          onChange={handleCountry}
          hint={t.fields.countryHint}
        />
        <Select
          label="Default currency"
          name="default_currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      <Textarea label={t.fields.address} name="address" rows={3} defaultValue={initial?.address ?? ""} />
      <CountryWarning code={country} />

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">{t.fields.bank}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label={t.fields.bankName} name="bank_name" defaultValue={initial?.bank_name ?? ""} />
          <Input label={t.fields.accountNumber} name="bank_account" defaultValue={initial?.bank_account ?? ""} />
          <Input label={t.fields.iban} name="bank_iban" defaultValue={initial?.bank_iban ?? ""} />
          <Input label={t.fields.swift} name="bank_swift" defaultValue={initial?.bank_swift ?? ""} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Shown on the invoice PDF as a payment block.</p>
      </div>

      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {t.common.save}
        </Button>
      </div>
    </form>
  );
}
