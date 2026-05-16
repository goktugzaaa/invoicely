"use client";

import * as React from "react";
import { Select } from "@/components/ui/Input";
import { COUNTRIES, getCountry } from "@/lib/countries";

export function CountrySelect({
  name,
  label,
  value,
  defaultValue,
  onChange,
  hint,
  required,
}: {
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Select
        label={label}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
      >
        <option value="">—</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name} {!c.supported ? "⚠" : ""}
          </option>
        ))}
      </Select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function CountryWarning({ code }: { code?: string | null }) {
  const c = getCountry(code);
  if (!c || c.supported) return null;
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <div className="font-semibold">⚠ {c.flag} {c.name} — local e-invoicing required</div>
      <p className="mt-0.5 text-amber-700">
        Paidly produces a clean PDF accepted by clients, but does NOT submit invoices to the
        national e-invoicing system (Italy SDI, Mexico CFDI, Brazil NF-e, India GST). For legal
        compliance use a local provider in addition.
      </p>
    </div>
  );
}
