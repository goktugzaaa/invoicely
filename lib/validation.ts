import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Invalid email").max(160).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description required").max(240),
  quantity: z.coerce.number().min(0.01, "Min 0.01"),
  unit_price: z.coerce.number().min(0),
});
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = z.object({
  client_id: z.string().uuid("Select a client"),
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  issue_date: z.string().min(1),
  due_date: z.string().optional().or(z.literal("")),
  currency: z.string().min(3).max(8).default("USD"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  notes: z.string().max(2000).optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "At least one item"),
});
export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const profileSchema = z.object({
  business_name: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Invalid email").max(160).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  tax_id: z.string().max(80).optional().or(z.literal("")),
  default_currency: z.string().min(3).max(8).default("USD"),
});
export type ProfileInput = z.infer<typeof profileSchema>;
