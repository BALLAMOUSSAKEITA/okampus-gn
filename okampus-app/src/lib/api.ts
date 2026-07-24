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

export async function apiUpload(
  path: string,
  formData: FormData,
  token?: string
): Promise<Response> {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const url = `${API_URL}${path}`;
  try {
    return await fetch(url, { method: "POST", headers, body: formData });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur reseau";
    throw new Error(
      `Impossible de joindre l'API (${url}). Verifie que le serveur FastAPI tourne sur le port 8000. ${message}`
    );
  }
}

export function resolveFileUrl(fileUrl: string): string {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return `${API_URL}${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`;
}

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

  const url = `${API_URL}${path}`;

  try {
    return await fetch(url, { ...rest, headers });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur reseau";
    throw new Error(
      `Impossible de joindre l'API (${url}). Verifie que le serveur FastAPI tourne sur le port 8000. ${message}`
    );
  }
}
