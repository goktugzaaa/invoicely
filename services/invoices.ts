import { createClient } from "@/lib/supabase/server";
import type {
  InvoiceWithClient,
  InvoiceWithItems,
  InvoiceItem,
  InvoiceStatus,
} from "@/types/db";

export interface ListInvoicesParams {
  q?: string;
  status?: InvoiceStatus | "all";
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export interface ListInvoicesResult {
  invoices: InvoiceWithClient[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listInvoices(
  userId: string,
  params: ListInvoicesParams = {}
): Promise<ListInvoicesResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase
    .from("invoices")
    .select("*, client:clients(id,name,email,company)", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.q && params.q.trim()) {
    query = query.ilike("invoice_number", `%${params.q.trim()}%`);
  }
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.clientId) {
    query = query.eq("client_id", params.clientId);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return {
    invoices: (data ?? []) as InvoiceWithClient[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getInvoice(userId: string, id: string): Promise<InvoiceWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, client:clients(id,name,email,company), items:invoice_items(*)")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const items = ((data as { items?: InvoiceItem[] }).items ?? [])
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
  return { ...(data as InvoiceWithItems), items };
}

export async function getActiveClientsForSelect(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, company")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}
