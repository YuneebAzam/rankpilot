import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config.
 *
 * This file contains NO database or bcrypt code so it can be imported by the
 * middleware (which runs on the Edge runtime). The full config in `src/auth.ts`
 * spreads this and adds the Prisma adapter + Credentials provider (Node only).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // Providers are added in the Node-only `src/auth.ts`.
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    // Route protection — runs in middleware.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      return true;
    },
    // Carry the user id through the JWT into the session.
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
