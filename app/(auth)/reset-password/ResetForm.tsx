"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/context";

const schema = z
  .object({
    password: z.string().min(8, "Min 8 characters"),
    confirm: z.string().min(8, "Min 8 characters"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

export function ResetForm() {
  const t = useT();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Confirm we have a recovery session (set by /auth/callback after exchange).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
      else setSessionError(t.auth.resetInvalid);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setServerError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard?flash=passwordReset");
      router.refresh();
    }, 1200);
  }

  if (sessionError) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        {sessionError}
      </div>
    );
  }

  if (!sessionReady) {
    return <div className="text-sm text-slate-500">…</div>;
  }

  if (success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        ✓ {t.auth.resetSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t.auth.newPassword}
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label={t.auth.confirmPassword}
        type="password"
        autoComplete="new-password"
        placeholder="Repeat password"
        {...register("confirm")}
        error={errors.confirm?.message}
      />
      {serverError && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
      )}
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t.auth.resetBtn}
      </Button>
    </form>
  );
}
