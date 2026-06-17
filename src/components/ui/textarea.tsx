import type { ComponentProps } from "react";

export function Textarea({
  label,
  hint,
  error,
  ...props
}: { label: string; hint?: string; error?: string } & ComponentProps<"textarea">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      {hint ? (
        <span className="mb-1.5 block text-xs text-[var(--color-muted)]">
          {hint}
        </span>
      ) : null}
      <textarea
        className="min-h-24 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)] disabled:opacity-60"
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      ) : null}
    </label>
  );
}
