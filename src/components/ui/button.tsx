import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:ring-[var(--color-accent)] disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_8px_24px_-8px_rgba(139,92,246,0.6)]",
  secondary:
    "bg-white/5 text-[var(--color-ink)] border border-[var(--color-line-strong)] hover:bg-white/10 backdrop-blur-sm",
  ghost: "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
};

const sizes: Record<Size, string> = {
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button className={`${buttonClass(variant, size)} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<typeof Link>) {
  return (
    <Link className={`${buttonClass(variant, size)} ${className}`} {...props}>
      {children}
    </Link>
  );
}
