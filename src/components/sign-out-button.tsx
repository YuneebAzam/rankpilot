"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
    >
      Sign out
    </button>
  );
}
