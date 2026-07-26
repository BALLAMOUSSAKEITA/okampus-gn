export function resolveCallbackUrl(raw: string | null | undefined, fallback = "/") {
  if (!raw) return fallback;
  return raw.startsWith("/") ? raw : fallback;
}
