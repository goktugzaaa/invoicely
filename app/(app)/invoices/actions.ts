"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { invoiceSchema, type InvoiceInput } from "@/lib/validation";
import type { InvoiceStatus } from "@/types/db";

function parseFormData(formData: FormData): InvoiceInput {
  const items: InvoiceInput["items"] = [];
  const descs = formData.getAll("item_description").map(String);
  const qtys = formData.getAll("item_quantity").map(String);
  const prices = formData.getAll("item_unit_price").map(String);
  for (let i = 0; i < descs.length; i++) {
    if (!descs[i] && !qtys[i] && !prices[i]) continue;
    items.push({
      description: descs[i] ?? "",
      quantity: Number(qtys[i] ?? 0),
      unit_price: Number(prices[i] ?? 0),
    });
  }
  return {
    client_id: String(formData.get("client_id") ?? ""),
    status: (String(formData.get("status") ?? "draft") as InvoiceStatus) || "draft",
    issue_date: String(formData.get("issue_date") ?? ""),
    due_date: String(formData.get("due_date") ?? ""),
    currency: String(formData.get("currency") ?? "USD"),
    tax_rate: Number(formData.get("tax_rate") ?? 0),
    discount: Number(formData.get("discount") ?? 0),
    po_number: String(formData.get("po_number") ?? ""),
    payment_terms: String(formData.get("payment_terms") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    items,
  };
}

function computeTotals(input: InvoiceInput) {
  const items = input.items.map((i) => ({
    description: i.description,
    quantity: i.quantity,
    unit_price: i.unit_price,
    total_price: Number((i.quantity * i.unit_price).toFixed(2)),
  }));
  const subtotal = items.reduce((s, i) => s + i.total_price, 0);
  const afterDiscount = Math.max(subtotal - (input.discount ?? 0), 0);
  const total = Number((afterDiscount + (afterDiscount * (input.tax_rate ?? 0)) / 100).toFixed(2));
  return { items, subtotal, total };
}

export async function createInvoiceAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = invoiceSchema.safeParse(parseFormData(formData));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0].message };

  const { items, subtotal, total } = computeTotals(parsed.data);

  const { data: numData, error: numErr } = await supabase.rpc("next_invoice_number", {
    p_user: user.id,
  });
  if (numErr) return { ok: false as const, error: numErr.message };

  const now = new Date().toISOString();
  const { data: invoice, error: invErr } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: parsed.data.client_id,
      invoice_number: numData as string,
      subtotal,
      tax_rate: parsed.data.tax_rate,
      discount: parsed.data.discount,
      total_amount: total,
      currency: parsed.data.currency,
      status: parsed.data.status,
      issue_date: parsed.data.issue_date,
      due_date: parsed.data.due_date || null,
      po_number: parsed.data.po_number || null,
      payment_terms: parsed.data.payment_terms || null,
      notes: parsed.data.notes || null,
      sent_at: parsed.data.status !== "draft" ? now : null,
      paid_at: parsed.data.status === "paid" ? now : null,
    })
    .select("id")
    .single();
  if (invErr) return { ok: false as const, error: invErr.message };

  const { error: itemsErr } = await supabase
    .from("invoice_items")
    .insert(items.map((i) => ({ ...i, invoice_id: invoice.id })));
  if (itemsErr) return { ok: false as const, error: itemsErr.message };

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  const openPdf = String(formData.get("open_pdf") ?? "") === "1";
  redirect(`/invoices/${invoice.id}?flash=invoiceCreated${openPdf ? "&openPdf=1" : ""}`);
}

export async function updateInvoiceAction(id: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = invoiceSchema.safeParse(parseFormData(formData));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0].message };

  const { items, subtotal, total } = computeTotals(parsed.data);

  const now = new Date().toISOString();
  const { data: cur } = await supabase
    .from("invoices")
    .select("status, sent_at, paid_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const patch: Record<string, unknown> = {
    client_id: parsed.data.client_id,
    status: parsed.data.status,
    issue_date: parsed.data.issue_date,
    due_date: parsed.data.due_date || null,
    currency: parsed.data.currency,
    tax_rate: parsed.data.tax_rate,
    discount: parsed.data.discount,
    subtotal,
    total_amount: total,
    po_number: parsed.data.po_number || null,
    payment_terms: parsed.data.payment_terms || null,
    notes: parsed.data.notes || null,
  };
  if (parsed.data.status !== "draft" && !cur?.sent_at) patch.sent_at = now;
  if (parsed.data.status === "paid" && !cur?.paid_at) patch.paid_at = now;

  const { error: updErr } = await supabase
    .from("invoices")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id);
  if (updErr) return { ok: false as const, error: updErr.message };

  const { error: delErr } = await supabase.from("invoice_items").delete().eq("invoice_id", id);
  if (delErr) return { ok: false as const, error: delErr.message };

  const { error: insErr } = await supabase
    .from("invoice_items")
    .insert(items.map((i) => ({ ...i, invoice_id: id })));
  if (insErr) return { ok: false as const, error: insErr.message };

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/dashboard");
  redirect(`/invoices/${id}?flash=invoiceUpdated`);
}

export async function deleteInvoiceAction(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect("/invoices?flash=invoiceDeleted");
}

export async function setInvoiceStatusAction(id: string, status: InvoiceStatus) {
  const { supabase, user } = await requireUser();
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status };
  if (status === "sent") patch.sent_at = now;
  if (status === "paid") {
    patch.paid_at = now;
    // ensure sent_at exists for activity timeline
    const { data } = await supabase.from("invoices").select("sent_at").eq("id", id).maybeSingle();
    if (!data?.sent_at) patch.sent_at = now;
  }
  const { error } = await supabase
    .from("invoices")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { ok: true as const };
}
