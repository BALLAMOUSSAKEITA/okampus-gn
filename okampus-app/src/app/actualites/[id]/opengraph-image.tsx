import { ImageResponse } from "next/og";
import { OgShareCard } from "@/lib/og-share-card";
import { getApiBase, OG_SIZE } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "Actualité BacheliO";
export const size = OG_SIZE;
export const contentType = "image/png";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;
  const api = getApiBase();

  let badge = "Actualité";
  let title = "Actualité BacheliO";
  let detail = "Nouveautés et opportunités pour les étudiants guinéens";

  try {
    const res = await fetch(`${api}/news/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const n = (await res.json()) as {
        title: string;
        summary: string;
        category: string;
      };
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
    { ...size }
  );
}
