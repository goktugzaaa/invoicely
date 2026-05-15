import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-slate-400 shadow-sm",
            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
            error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }
>(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm",
          "placeholder:text-slate-400 shadow-sm",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }
>(({ className, label, error, children, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
          error && "border-rose-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";
