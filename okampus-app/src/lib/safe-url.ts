const BLOCKED_SCHEMES = new Set(["javascript:", "data:", "vbscript:", "file:"]);

function parseExternalUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return null;
  }

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(normalized);
    if (BLOCKED_SCHEMES.has(`${url.protocol}`)) return null;
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url;
  } catch {
    return null;
  }
}

/** Retourne une URL https/http sûre ou null. */
export function sanitizeExternalHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = parseExternalUrl(raw);
  return url?.href ?? null;
}

/** Liens internes (/chemin) ou externes https. */
export function sanitizeLinkHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^\/(?!\/|\\)/.test(trimmed)) return trimmed;
  if (trimmed.startsWith("mailto:") && /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed)) {
    return trimmed;
  }
  return sanitizeExternalHref(trimmed);
}

/** Normalise un domaine sans schéma pour affichage + lien. */
export function websiteToHref(website: string): string | null {
  return sanitizeExternalHref(website);
}
