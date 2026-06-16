import type { ComponentProps } from "react";

export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & ComponentProps<"input">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      <input
        className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]"
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : null}
    </label>
  );
}
