"use client";

import * as React from "react";
import { Select } from "@/components/ui/Input";
import { COUNTRIES } from "@/lib/countries";

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
            {c.flag} {c.name}
          </option>
        ))}
      </Select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// Backward compat — no countries are restricted anymore.
export function CountryWarning(_props: { code?: string | null }) {
  return null;
}
