-- Invoice + Client Tracker — Supabase schema
-- Run in Supabase SQL editor

-- Enums
create type client_status as enum ('active', 'inactive');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue');

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  status client_status not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists clients_user_id_idx on public.clients(user_id);

-- Invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  invoice_number text not null,
  total_amount numeric(12,2) not null default 0,
  status invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index if not exists invoices_user_id_idx on public.invoices(user_id);
create index if not exists invoices_client_id_idx on public.invoices(client_id);

-- Invoice items
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0
);

create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

-- Auto-number sequence per user via function
create or replace function public.next_invoice_number(p_user uuid)
returns text
language plpgsql
as $$
declare
  n int;
begin
  select coalesce(max(
    nullif(regexp_replace(invoice_number, '\D', '', 'g'), '')::int
  ), 0) + 1
    into n
  from public.invoices
  where user_id = p_user;
  return 'INV-' || lpad(n::text, 4, '0');
end;
$$;

-- Recalculate invoice totals from items
create or replace function public.recalc_invoice_total(p_invoice uuid)
returns void
language sql
as $$
  update public.invoices
  set total_amount = coalesce((
    select sum(total_price) from public.invoice_items where invoice_id = p_invoice
  ), 0)
  where id = p_invoice;
$$;

-- RLS
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

drop policy if exists "clients_owner_all" on public.clients;
create policy "clients_owner_all" on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "invoices_owner_all" on public.invoices;
create policy "invoices_owner_all" on public.invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "invoice_items_owner_all" on public.invoice_items;
create policy "invoice_items_owner_all" on public.invoice_items
  for all using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
    )
  );
