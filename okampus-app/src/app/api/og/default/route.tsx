import { ImageResponse } from "next/og";
import { OgShareCard } from "@/lib/og-share-card";
import { OG_SIZE } from "@/lib/site-config";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <OgShareCard
        badge="Plateforme"
        title="BacheliO — du bac à l'emploi"
        detail="Orientation IA · Mentorat · Bourses · Forum · Stages"
        footer="www.bachelio.com"
      />
    ),
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
