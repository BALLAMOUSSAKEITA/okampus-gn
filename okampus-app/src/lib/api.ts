/**
 * Helper pour appeler l'API FastAPI depuis le frontend Next.js.
 * - Côté client : passe par /api/backend (token JWT jamais exposé au navigateur)
 * - Côté serveur : appelle directement l'API avec le token serveur si besoin
 */

const SERVER_API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const isBrowser = typeof window !== "undefined";

function resolveUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (isBrowser) {
    return `/api/backend${normalized}`;
  }
  return `${SERVER_API_URL}${normalized}`;
}

export const API_URL = isBrowser ? "/api/backend" : SERVER_API_URL;

export async function apiUpload(path: string, formData: FormData): Promise<Response> {
  const url = resolveUrl(path);
  try {
    return await fetch(url, { method: "POST", body: formData });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur réseau";
    throw new Error(`Impossible de joindre l'API (${url}). ${message}`);
  }
}

export function resolveDownloadUrl(resourceId: string): string {
  return `/api/backend/resources/${resourceId}/download`;
}

/** @deprecated Utiliser resolveDownloadUrl — conservé pour compatibilité interne */
export function resolveFileUrl(fileUrl: string, resourceId?: string): string {
  if (resourceId) return resolveDownloadUrl(resourceId);
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return resolveUrl(fileUrl);
}

export async function apiFetch(
  path: string,
  options: RequestInit & { serverToken?: string } = {}
): Promise<Response> {
  const { serverToken, ...rest } = options;
  const headers = new Headers(rest.headers ?? {});

  if (!(rest.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!isBrowser && serverToken) {
    headers.set("Authorization", `Bearer ${serverToken}`);
  }

  const url = resolveUrl(path);

  try {
    return await fetch(url, { ...rest, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur réseau";
    throw new Error(`Impossible de joindre l'API (${url}). ${message}`);
  }
}
