/**
 * Helper pour appeler l'API FastAPI depuis le frontend Next.js.
 * - Côté client : utilise NEXT_PUBLIC_API_URL
 * - Côté serveur (Server Components / API routes) : utilise API_URL
 */

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export { API_URL };

export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<Response> {
  const { token, ...rest } = options;
  const headers = new Headers(rest.headers ?? {});

  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, { ...rest, headers });
}
