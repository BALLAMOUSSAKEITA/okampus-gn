export function resolveCallbackUrl(raw: string | null | undefined, fallback = "/assistant") {
  if (!raw) return fallback;
  return raw.startsWith("/") ? raw : fallback;
}
