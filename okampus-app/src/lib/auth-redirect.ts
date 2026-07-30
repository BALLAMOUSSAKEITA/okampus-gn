/** N'accepte que les chemins relatifs internes (bloque //evil.com et schémas). */
export function resolveCallbackUrl(raw: string | null | undefined, fallback = "/") {
  if (!raw) return fallback;
  if (!/^\/(?!\/|\\)/.test(raw)) return fallback;
  if (/[\u0000-\u001F]/.test(raw)) return fallback;
  return raw;
}
