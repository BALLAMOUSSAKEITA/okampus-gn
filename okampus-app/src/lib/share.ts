/** URL publique canonique du site (partage, Open Graph). */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "https://www.bachelio.com"
  );
}

export function buildFacebookShareUrl(pageUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
}

export async function copyPageUrl(pageUrl: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(pageUrl);
    return true;
  } catch {
    return false;
  }
}
