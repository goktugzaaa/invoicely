"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { clientSchema } from "@/lib/validation";

function parseFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    address: String(formData.get("address") ?? ""),
    vat_id: String(formData.get("vat_id") ?? ""),
    country: String(formData.get("country") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    status: (formData.get("status") as "active" | "inactive") || "active",
  };
}

function rowFrom(parsed: ReturnType<typeof clientSchema.parse>) {
  return {
    name: parsed.name,
    email: parsed.email || null,
    phone: parsed.phone || null,
    company: parsed.company || null,
    address: parsed.address || null,
    vat_id: parsed.vat_id || null,
    country: parsed.country ? parsed.country.toUpperCase() : null,
    notes: parsed.notes || null,
    status: parsed.status,
  };
}

export async function createClientAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = clientSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    ...rowFrom(parsed.data),
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  redirect("/clients?flash=clientCreated");
}

export async function updateClientAction(id: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = clientSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const { error } = await supabase
    .from("clients")
    .update(rowFrom(parsed.data))
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}?flash=clientUpdated`);
}

export async function deleteClientAction(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/clients");
  redirect("/clients?flash=clientDeleted");
}
