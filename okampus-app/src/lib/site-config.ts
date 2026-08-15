export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "https://www.bachelio.com"
  );
}

export function getApiBase(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:8000"
  );
}

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/DBDMMx3ZWvaCDrFXAwt2W1";
