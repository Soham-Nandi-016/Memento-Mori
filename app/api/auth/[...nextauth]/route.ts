import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";

// ── Extend next-auth types so accessToken is strongly typed ──────────────────
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Full scope list — must be explicit for Drive access
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly",
          // Required to receive a refresh_token on every sign-in
          access_type: "offline",
          // Force the consent screen every time so scope is never silently narrowed
          prompt: "consent",
          // Prevent Google merging with a previously-cached narrower consent grant
          include_granted_scopes: false,
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // First sign-in: persist tokens from Google OAuth
      if (account) {
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt    = account.expires_at;
        return token;
      }

      // Token still valid — pass through
      const nowSec = Math.floor(Date.now() / 1000);
      if (token.expiresAt && nowSec < token.expiresAt - 60) {
        return token;
      }

      // Token expired — attempt silent refresh
      if (!token.refreshToken) return token; // nothing we can do
      try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id:     process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type:    "refresh_token",
            refresh_token: token.refreshToken,
          }),
          cache: "no-store",
        });
        if (res.ok) {
          const refreshed = await res.json() as {
            access_token: string;
            expires_in: number;
          };
          token.accessToken = refreshed.access_token;
          token.expiresAt   = Math.floor(Date.now() / 1000) + refreshed.expires_in;
        }
      } catch (_) {
        // Refresh failed — token will stay stale; Drive action will handle the 401
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the access token to the client session
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
