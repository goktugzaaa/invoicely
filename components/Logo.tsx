import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const markSizes: Record<Size, number> = { sm: 28, md: 36, lg: 48, xl: 96 };
const textSizes: Record<Size, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
};

export function LogoMark({ size = "md", className }: { size?: Size; className?: string }) {
  const px = markSizes[size];
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0c1a3a]", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src="/logo.png"
        alt="Invoicely"
        width={px * 3}
        height={px * 3}
        priority
        className="h-full w-full object-contain"
      />
    </span>
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
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showText && (
        <span className={cn("font-semibold tracking-tight text-slate-900", textSizes[size])}>
          Invoicely
        </span>
      )}
    </span>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
