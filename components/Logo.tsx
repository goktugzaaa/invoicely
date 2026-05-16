import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const markPx: Record<Size, number> = { sm: 28, md: 34, lg: 48, xl: 96 };
const textSize: Record<Size, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

/**
 * Nib mark — calligraphy pen nib silhouette inside a rounded navy square.
 * Pure inline SVG; no external image asset.
 */
export function LogoMark({ size = "md", className }: { size?: Size; className?: string }) {
  const px = markPx[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="2" y="2" width="36" height="36" rx="8" fill="#0c1a3a" />
      {/* nib body — tapered downward */}
      <path d="M14 10 H26 L30 22 L20 34 L10 22 Z" fill="#ffffff" />
      {/* center slit */}
      <line x1="20" y1="14" x2="20" y2="30" stroke="#0c1a3a" strokeWidth="1.2" strokeLinecap="round" />
      {/* ink dot tip — cyan accent */}
      <circle cx="20" cy="33" r="1.8" fill="#22d3ee" />
    </svg>
  );
}

export function Brand({
  size = "md",
  href = "/",
  showText = true,
  className,
}: {
  size?: Size;
  href?: string | null;
  showText?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showText && (
        <span className={cn("font-serif italic tracking-tight text-slate-900", textSize[size])}>
          Nib
        </span>
      )}
    </span>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
