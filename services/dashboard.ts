import { createClient } from "@/lib/supabase/server";
import type { InvoiceWithClient, InvoiceStatus } from "@/types/db";

export type DashboardRange = "7d" | "30d" | "90d" | "12m" | "all";

export interface MonthlyPoint {
  month: string;
  revenue: number;
}

export interface StatusPoint {
  status: InvoiceStatus;
  count: number;
  amount: number;
}

export type ActivityKind =
  | "invoice_created"
  | "invoice_sent"
  | "invoice_paid"
  | "client_created";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  at: string;
  invoice?: { id: string; number: string; client_name: string | null; amount: number; currency: string };
  client?: { id: string; name: string };
}

export interface DashboardStats {
  range: DashboardRange;
  totalRevenue: number;
  rangeRevenue: number;
  unpaidCount: number;
  unpaidAmount: number;
  activeClients: number;
  recent: InvoiceWithClient[];
  monthly: MonthlyPoint[];
  statuses: StatusPoint[];
  activity: ActivityItem[];
  hasOnboardingNeeded: boolean;
}

function rangeStartISO(r: DashboardRange): string | null {
  if (r === "all") return null;
  const d = new Date();
  if (r === "7d") d.setDate(d.getDate() - 7);
  else if (r === "30d") d.setDate(d.getDate() - 30);
  else if (r === "90d") d.setDate(d.getDate() - 90);
  else if (r === "12m") d.setMonth(d.getMonth() - 12);
  return d.toISOString().slice(0, 10);
}

function lastNMonths(n: number) {
  const now = new Date();
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });
    out.push({ key, label });
  }
  return out;
}

export async function getDashboardStats(
  userId: string,
  range: DashboardRange = "30d"
): Promise<DashboardStats> {
  const supabase = await createClient();
  const sinceISO = rangeStartISO(range);

  const sinceMonth = new Date();
  sinceMonth.setMonth(sinceMonth.getMonth() - 11);
  sinceMonth.setDate(1);
  const sinceMonthISO = sinceMonth.toISOString().slice(0, 10);

  let rangePaidQuery = supabase
    .from("invoices")
    .select("total_amount")
    .eq("user_id", userId)
    .eq("status", "paid");
  if (sinceISO) rangePaidQuery = rangePaidQuery.gte("issue_date", sinceISO);

  const [paidAllRes, paidRangeRes, unpaidRes, clientsRes, recentRes, trendRes, statusRes, recentInvAct, recentCliAct, anyClientsRes, anyInvoicesRes, profileRes] = await Promise.all([
    supabase.from("invoices").select("total_amount").eq("user_id", userId).eq("status", "paid"),
    rangePaidQuery,
    supabase.from("invoices").select("total_amount, status").eq("user_id", userId).in("status", ["sent", "overdue"]),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
    supabase
      .from("invoices")
      .select("*, client:clients(id,name,email,company)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("invoices")
      .select("issue_date, total_amount, status")
      .eq("user_id", userId)
      .eq("status", "paid")
      .gte("issue_date", sinceMonthISO),
    supabase.from("invoices").select("status, total_amount").eq("user_id", userId),
    supabase
      .from("invoices")
      .select("id, invoice_number, created_at, sent_at, paid_at, total_amount, currency, client:clients(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("clients")
      .select("id, name, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("profiles").select("business_name, logo_path").eq("user_id", userId).maybeSingle(),
  ]);

  const totalRevenue =
    paidAllRes.data?.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0) ?? 0;
  const rangeRevenue =
    paidRangeRes.data?.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0) ?? 0;
  const unpaidAmount =
    unpaidRes.data?.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0) ?? 0;

  const months = lastNMonths(12);
  const bucket = new Map(months.map((m) => [m.key, 0]));
  for (const r of trendRes.data ?? []) {
    const key = (r.issue_date as string).slice(0, 7);
    if (bucket.has(key)) bucket.set(key, (bucket.get(key) ?? 0) + Number(r.total_amount ?? 0));
  }
  const monthly: MonthlyPoint[] = months.map((m) => ({
    month: m.label,
    revenue: Number((bucket.get(m.key) ?? 0).toFixed(2)),
  }));

  const statusMap = new Map<InvoiceStatus, { count: number; amount: number }>();
  for (const r of statusRes.data ?? []) {
    const s = r.status as InvoiceStatus;
    const cur = statusMap.get(s) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += Number(r.total_amount ?? 0);
    statusMap.set(s, cur);
  }
  const statuses: StatusPoint[] = (
    ["draft", "sent", "paid", "overdue"] as InvoiceStatus[]
  ).map((s) => ({
    status: s,
    count: statusMap.get(s)?.count ?? 0,
    amount: statusMap.get(s)?.amount ?? 0,
  }));

  const invActs: ActivityItem[] = [];
  for (const row of recentInvAct.data ?? []) {
    const client = (row as { client?: { name?: string | null } | { name?: string | null }[] }).client;
    const clientName = Array.isArray(client) ? client[0]?.name ?? null : client?.name ?? null;
    const inv = {
      id: row.id as string,
      number: row.invoice_number as string,
      client_name: clientName,
      amount: Number(row.total_amount ?? 0),
      currency: (row.currency as string) || "USD",
    };
    invActs.push({
      id: `inv-c-${row.id}`,
      kind: "invoice_created",
      at: row.created_at as string,
      invoice: inv,
    });
    if (row.sent_at) {
      invActs.push({
        id: `inv-s-${row.id}`,
        kind: "invoice_sent",
        at: row.sent_at as string,
        invoice: inv,
      });
    }
    if (row.paid_at) {
      invActs.push({
        id: `inv-p-${row.id}`,
        kind: "invoice_paid",
        at: row.paid_at as string,
        invoice: inv,
      });
    }
  }
  const cliActs: ActivityItem[] = (recentCliAct.data ?? []).map((row) => ({
    id: `cli-${row.id}`,
    kind: "client_created",
    at: row.created_at as string,
    client: { id: row.id as string, name: row.name as string },
  }));
  const activity = [...invActs, ...cliActs]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10);

  const hasOnboardingNeeded =
    !profileRes.data?.business_name ||
    (anyClientsRes.count ?? 0) === 0 ||
    (anyInvoicesRes.count ?? 0) === 0;

  return {
    range,
    totalRevenue,
    rangeRevenue,
    unpaidCount: unpaidRes.data?.length ?? 0,
    unpaidAmount,
    activeClients: clientsRes.count ?? 0,
    recent: (recentRes.data ?? []) as InvoiceWithClient[],
    monthly,
    statuses,
    activity,
    hasOnboardingNeeded,
  };
}
