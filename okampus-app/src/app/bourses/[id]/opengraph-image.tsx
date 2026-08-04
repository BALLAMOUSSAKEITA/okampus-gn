import { ImageResponse } from "next/og";
import { OgShareCard } from "@/lib/og-share-card";
import { getApiBase, OG_SIZE } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "Bourse sur BacheliO";
export const size = OG_SIZE;
export const contentType = "image/png";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;
  const api = getApiBase();

  let badge = "Bourse";
  let title = "Opportunité de bourse";
  let subtitle = "BacheliO";
  let detail = "Orientation, bourses et mentorat pour les étudiants guinéens";

  try {
    const res = await fetch(`${api}/scholarships/${id}`, { next: { revalidate: 300 } });
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
    { ...size }
  );
}
