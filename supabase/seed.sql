-- Demo seed. Replace USER_UUID with your auth.users.id after signup.
-- Run after schema.sql.

do $$
declare
  uid uuid := 'REPLACE-WITH-USER-UUID';
  c1 uuid;
  c2 uuid;
  inv1 uuid;
begin
  insert into public.clients (user_id, name, email, phone, company, status)
  values (uid, 'Acme Corp', 'billing@acme.test', '+1 555 0100', 'Acme', 'active')
  returning id into c1;

  insert into public.clients (user_id, name, email, company, status)
  values (uid, 'Globex Ltd', 'ap@globex.test', 'Globex', 'active')
  returning id into c2;

  insert into public.invoices (user_id, client_id, invoice_number, status, issue_date, due_date)
  values (uid, c1, public.next_invoice_number(uid), 'sent', current_date, current_date + 14)
  returning id into inv1;

  insert into public.invoice_items (invoice_id, description, quantity, unit_price, total_price)
  values
    (inv1, 'Landing page design', 1, 1200, 1200),
    (inv1, 'Frontend implementation (hours)', 10, 90, 900);

  perform public.recalc_invoice_total(inv1);
end $$;
