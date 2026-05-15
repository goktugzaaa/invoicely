"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { removeLogoAction } from "./actions";
import { useT } from "@/lib/i18n/context";

export function LogoUploader({
  logoUrl,
  hasLogo,
}: {
  logoUrl: string | null;
  hasLogo: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemove, startRemove] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|svg\+xml|webp)$/.test(file.type)) {
      setError("PNG, JPG, SVG or WEBP only.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Max 2MB.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not signed in.");
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${uid}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase
        .from("profiles")
        .upsert(
          { user_id: uid, logo_path: path, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      if (dbErr) throw dbErr;
      router.push("/settings?flash=logoUpdated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onRemove() {
    if (!confirm(t.settings.removeConfirm)) return;
    startRemove(async () => {
      await removeLogoAction();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="max-h-28 max-w-full object-contain" />
        ) : (
          <span className="text-xs text-slate-500">{t.settings.noLogo}</span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={onFile}
        className="hidden"
      />
      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      <div className="flex gap-2">
        <Button type="button" variant="outline" loading={busy} onClick={() => fileRef.current?.click()}>
          {hasLogo ? t.settings.replace : t.settings.upload}
        </Button>
        {hasLogo && (
          <Button type="button" variant="ghost" loading={pendingRemove} onClick={onRemove}>
            {t.settings.remove}
          </Button>
        )}
      </div>
      <p className="text-xs text-slate-500">{t.settings.logoHint}</p>
    </div>
  );
}
