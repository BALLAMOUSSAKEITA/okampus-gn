import type { Metadata } from "next";
import ScholarshipDetailClient from "./ScholarshipDetail";
import { getApiBase, getSiteOrigin } from "@/lib/site-config";

const API = getApiBase();
const SITE = getSiteOrigin();

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pageUrl = `/bourses/${id}`;
  const ogImage = `${pageUrl}/opengraph-image`;

  try {
    const res = await fetch(`${API}/scholarships/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "Bourse introuvable | BacheliO" };
    const s = (await res.json()) as { title: string; description: string; organization: string };
    return {
      title: `${s.title} | BacheliO`,
      description: s.description,
      openGraph: {
        title: s.title,
        description: s.description,
        url: pageUrl,
        type: "article",
        siteName: "BacheliO",
        locale: "fr_FR",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${s.title} — ${s.organization}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: s.title,
        description: s.description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Bourse | BacheliO" };
  }
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  return <ScholarshipDetailClient id={id} />;
}
