export type ClientStatus = "active" | "inactive";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  vat_id: string | null;
  country: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  subtotal: number;
  tax_rate: number;
  discount: number;
  total_amount: number;
  currency: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  po_number: string | null;
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
}

export interface Profile {
  user_id: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  logo_path: string | null;
  default_currency: string;
  country: string | null;
  bank_name: string | null;
  bank_iban: string | null;
  bank_swift: string | null;
  bank_account: string | null;
  updated_at: string;
}

export interface InvoiceWithClientFull extends Invoice {
  client: Client | null;
}

export interface InvoiceWithClient extends Invoice {
  client: Pick<Client, "id" | "name" | "email" | "company"> | null;
}

export interface InvoiceWithItems extends InvoiceWithClient {
  items: InvoiceItem[];
}
