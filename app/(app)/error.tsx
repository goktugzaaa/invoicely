"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">{error.message}</p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
