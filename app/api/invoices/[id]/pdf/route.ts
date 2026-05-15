import { requireUser } from "@/lib/auth";
import { getInvoice } from "@/services/invoices";
import { getProfile, fetchLogoBytes } from "@/services/profile";
import { renderInvoicePdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await requireUser();
    const invoice = await getInvoice(user.id, id);
    if (!invoice) return new Response("Not found", { status: 404 });

    const profile = await getProfile(user.id);
    const logoBytes = profile?.logo_path ? await fetchLogoBytes(profile.logo_path) : null;

    const bytes = await renderInvoicePdf(invoice, {
      profile,
      logoBytes,
      fallbackName: user.user_metadata?.full_name || user.email || "Invoicely",
      fallbackEmail: user.email ?? "",
    });

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[pdf route]", err);
    return new Response(`PDF error: ${msg}`, { status: 500 });
  }
}
