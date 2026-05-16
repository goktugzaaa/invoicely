"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/context";

const schema = z.object({ email: z.string().email("Invalid email") });
type FormData = z.infer<typeof schema>;

export function ForgotForm() {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setServerError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${origin}/auth/callback?type=recovery`,
    });
    if (error) {
      // Show generic success regardless to avoid user enumeration,
      // but log/show error if it's a network/config issue
      if (!/rate|valid/i.test(error.message)) {
        setServerError(error.message);
        return;
      }
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        ✓ {t.auth.forgotSent}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t.common.email}
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        {...register("email")}
        error={errors.email?.message}
      />
      {serverError && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
      )}
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t.auth.forgotBtn}
      </Button>
    </form>
  );
}
