import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  overdue: "bg-rose-50 text-rose-700 ring-rose-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function Badge({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const tone = tones[value] ?? "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize",
        tone,
        className
      )}
    >
      {label ?? value}
    </span>
  );
}
