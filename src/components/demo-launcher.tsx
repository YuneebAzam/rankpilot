"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/**
 * Wraps the hero product mockup and turns it into a one-click live demo:
 * clicking signs in as the seeded demo user (see prisma/seed.ts) and lands
 * on the dashboard — no login screen, no typing credentials.
 */
export function DemoLauncher({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      aria-label="Open the live demo dashboard"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        void signIn("credentials", {
          email: "demo@rankpilot.app",
          password: "demo1234",
          callbackUrl: "/dashboard",
        });
      }}
      className="group relative block w-full cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1"
    >
      {children}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#08080c] shadow-lg">
          {loading ? "Opening demo…" : "Open live demo →"}
        </span>
      </span>
    </button>
  );
}
