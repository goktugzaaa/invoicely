"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/context";

const DEMO = { email: "demo@paidly.app", password: "Demo1234!" };

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const t = useT();
  const router = useRouter();
  const search = useSearchParams();
  const isDemo = search.get("demo") === "1";
  const [serverError, setServerError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const triedDemo = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isDemo ? DEMO : undefined,
  });

  async function doSignIn(values: FormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setServerError(error.message);
      return false;
    }
    const redirect = search.get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
    return true;
  }

  // Auto-login if ?demo=1
  useEffect(() => {
    if (!isDemo || triedDemo.current) return;
    triedDemo.current = true;
    setValue("email", DEMO.email);
    setValue("password", DEMO.password);
    setDemoLoading(true);
    doSignIn(DEMO).finally(() => setDemoLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  const submitting = isSubmitting || demoLoading;

  return (
    <form onSubmit={handleSubmit(doSignIn)} className="space-y-4">
      {isDemo && (
        <div className="rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-700">
          Signing you in to the demo workspace…
        </div>
      )}
      <Input
        label={t.common.email}
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <div>
        <Input
          label={t.auth.password}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="mt-1.5 text-right">
          <a
            href="/forgot-password"
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {t.auth.forgotLink}
          </a>
        </div>
      </div>
      {serverError && (
        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
      )}
      <Button type="submit" className="w-full" loading={submitting}>
        {t.auth.signInBtn}
      </Button>
    </form>
  );
}
