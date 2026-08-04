import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgShareCard } from "@/lib/og-share-card";
import { getApiBase, OG_SIZE } from "@/lib/site-config";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const api = getApiBase();

  let badge = "Bourse";
  let title = "Opportunité de bourse";
  let subtitle = "BacheliO";
  let detail = "Orientation, bourses et mentorat pour les étudiants guinéens";

  try {
    const res = await fetch(`${api}/scholarships/${id}`, { cache: "no-store" });
    if (res.ok) {
      const s = (await res.json()) as {
        title: string;
        type: string;
        organization: string;
        description: string;
        location?: string | null;
        amount?: string | null;
      };
      badge = s.type || "Bourse";
      title = s.title;
      subtitle = s.organization;
      detail = [s.location, s.amount, s.description].filter(Boolean).join(" · ");
    }
  } catch {
    /* fallback visuel */
  }

  return new ImageResponse(
    (
      <OgShareCard
        badge={badge}
        title={title}
        subtitle={subtitle}
        detail={detail}
        footer="bachelio.com/bourses"
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
