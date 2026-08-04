import { ImageResponse } from "next/og";
import { OgShareCard } from "@/lib/og-share-card";
import { OG_SIZE } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "BacheliO — La plateforme étudiante";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgShareCard
        badge="Plateforme"
        title="BacheliO — du bac à l'emploi"
        detail="Orientation IA · Mentorat · Bourses · Forum · Stages"
        footer="www.bachelio.com"
      />
    ),
    { ...size }
  );
}
