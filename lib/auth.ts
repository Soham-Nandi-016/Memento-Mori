import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * Server-side: get the current session or redirect to login.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}

/**
 * Extend next-auth types to include accessToken
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
