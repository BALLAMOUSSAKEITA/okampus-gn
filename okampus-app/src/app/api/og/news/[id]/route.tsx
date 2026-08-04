import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgShareCard } from "@/lib/og-share-card";
import { getApiBase, OG_SIZE } from "@/lib/site-config";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const api = getApiBase();

  let badge = "Actualité";
  let title = "Actualité BacheliO";
  let detail = "Nouveautés et opportunités pour les étudiants guinéens";

  try {
    const res = await fetch(`${api}/news/${id}`, { cache: "no-store" });
    if (res.ok) {
      const n = (await res.json()) as { title: string; summary: string; category: string };
      badge = n.category || "Actualité";
      title = n.title;
      detail = n.summary;
    }
  } catch {
    /* fallback visuel */
  }

  return new ImageResponse(
    (
      <OgShareCard
        badge={badge}
        title={title}
        detail={detail}
        footer="bachelio.com/actualites"
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
