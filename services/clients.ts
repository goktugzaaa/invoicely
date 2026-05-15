import { createClient } from "@/lib/supabase/server";
import type { Client, ClientStatus } from "@/types/db";

export interface ListClientsParams {
  q?: string;
  status?: ClientStatus | "all";
  page?: number;
  pageSize?: number;
}

export interface ListClientsResult {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listClients(
  userId: string,
  params: ListClientsParams = {}
): Promise<ListClientsResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.q && params.q.trim()) {
    const q = `%${params.q.trim()}%`;
    query = query.or(`name.ilike.${q},email.ilike.${q},company.ilike.${q}`);
  }
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return {
    clients: (data ?? []) as Client[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getClient(userId: string, id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Client) ?? null;
}

export async function getClientInvoices(userId: string, clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
