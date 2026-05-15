"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/context";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setServerError(error.message);
      return;
    }
    const redirect = search.get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
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
      <Input
        label={t.auth.password}
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />
      {serverError && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
      )}
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t.auth.signInBtn}
      </Button>
    </form>
  );
}
