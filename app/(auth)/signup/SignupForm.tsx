"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/context";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const t = useT();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setServerError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp(values);
    if (error) {
      setServerError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo(t.auth.confirmEmail);
    }
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
        autoComplete="new-password"
        placeholder="At least 6 characters"
        {...register("password")}
        error={errors.password?.message}
      />
      {serverError && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
      )}
      {info && (
        <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</div>
      )}
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t.auth.createBtn}
      </Button>
    </form>
  );
}
