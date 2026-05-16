import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { getLocale } from "@/lib/i18n/server";
import { FlashToast } from "@/components/Toast";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Paidly — Invoices & clients in one place",
    template: "%s · Paidly",
  },
  description:
    "A lightweight workspace for freelancers and small agencies. Track clients, send PDF invoices, and watch revenue land — without spreadsheets.",
  applicationName: "Paidly",
  keywords: [
    "invoice",
    "freelancer",
    "saas",
    "client management",
    "pdf invoice",
    "billing",
  ],
  authors: [{ name: "Paidly" }],
  openGraph: {
    title: "Paidly — Invoices & clients in one place",
    description:
      "Track clients, send PDF invoices, get paid. Built for freelancers and small agencies.",
    type: "website",
    siteName: "Paidly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paidly — Invoices & clients in one place",
    description:
      "Track clients, send PDF invoices, get paid. Built for freelancers and small agencies.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f3df5",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans">
        <I18nProvider locale={locale}>
          {children}
          <FlashToast />
        </I18nProvider>
      </body>
    </html>
  );
}
