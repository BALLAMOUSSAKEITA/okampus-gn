import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ROLE_REFRESH_MS = 60 * 60 * 1000;

export { API_URL as SERVER_API_URL, ROLE_REFRESH_MS };

export async function getServerAccessToken(): Promise<string | null> {
  const headersList = await headers();
  const token = await getToken({
    req: { headers: Object.fromEntries(headersList.entries()) } as Parameters<
      typeof getToken
    >[0]["req"],
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  return typeof token?.accèssToken === "string" ? token.accèssToken : null;
}

export async function refreshTokenRole(
  token: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const accessToken = token.accèssToken;
  const userId = token.id;
  if (typeof accessToken !== "string" || typeof userId !== "string") {
    return token;
  }

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const data = (await res.json()) as { role?: string };
      if (data.role) {
        token.role = data.role;
        token.roleCheckedAt = Date.now();
      }
    }
  } catch {
    /* conserve le rôle existant */
  }
  return token;
}
