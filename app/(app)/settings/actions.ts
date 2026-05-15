"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";

export async function saveProfileAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = profileSchema.safeParse({
    business_name: String(formData.get("business_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    tax_id: String(formData.get("tax_id") ?? ""),
    default_currency: String(formData.get("default_currency") ?? "USD"),
    country: String(formData.get("country") ?? ""),
    bank_name: String(formData.get("bank_name") ?? ""),
    bank_iban: String(formData.get("bank_iban") ?? ""),
    bank_swift: String(formData.get("bank_swift") ?? ""),
    bank_account: String(formData.get("bank_account") ?? ""),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        business_name: parsed.data.business_name || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
        tax_id: parsed.data.tax_id || null,
        default_currency: parsed.data.default_currency,
        country: parsed.data.country ? parsed.data.country.toUpperCase() : null,
        bank_name: parsed.data.bank_name || null,
        bank_iban: parsed.data.bank_iban || null,
        bank_swift: parsed.data.bank_swift || null,
        bank_account: parsed.data.bank_account || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/settings");
  return { ok: true as const };
}

export async function removeLogoAction() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("logo_path")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.logo_path) {
    await supabase.storage.from("logos").remove([profile.logo_path]);
  }
  await supabase.from("profiles").update({ logo_path: null }).eq("user_id", user.id);
  revalidatePath("/settings");
  return { ok: true as const };
}
