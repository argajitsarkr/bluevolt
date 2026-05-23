import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_URL } from "@/lib/api";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      isAdmin: boolean;
      fullName: string;
      phone: string;
      backendToken: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        if (!creds?.email || !creds?.password) return null;
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: creds.email, password: creds.password }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.full_name || data.user.email,
            isAdmin: !!data.user.is_admin,
            fullName: data.user.full_name || "",
            phone: data.user.phone || "",
            backendToken: data.access_token,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.isAdmin = (user as any).isAdmin;
        token.fullName = (user as any).fullName;
        token.phone = (user as any).phone;
        token.backendToken = (user as any).backendToken;
      }
      if (trigger === "update" && session) {
        if (session.fullName !== undefined) token.fullName = session.fullName;
        if (session.phone !== undefined) token.phone = session.phone;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.id as string;
      (session.user as any).isAdmin = !!token.isAdmin;
      (session.user as any).fullName = (token.fullName as string) || "";
      (session.user as any).phone = (token.phone as string) || "";
      (session.user as any).backendToken = (token.backendToken as string) || "";
      return session;
    },
  },
});
