import type { Metadata } from "next";
import ActualiteDetailClient from "./ActualiteDetail";
import { getApiBase } from "@/lib/site-config";

const API = getApiBase();

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pageUrl = `/actualites/${id}`;
  const ogImage = "/images/og-share.png";

  try {
    const res = await fetch(`${API}/news/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "Actualité introuvable | BacheliO" };
    const n = (await res.json()) as { title: string; summary: string; category: string };
    return {
      title: `${n.title} | BacheliO`,
      description: n.summary,
      openGraph: {
        title: n.title,
        description: n.summary,
        url: pageUrl,
        type: "article",
        siteName: "BacheliO",
        locale: "fr_FR",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${n.title} — ${n.category}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: n.title,
        description: n.summary,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Actualité | BacheliO" };
  }
}

export default async function ActualiteDetailPage({ params }: Props) {
  const { id } = await params;
  return <ActualiteDetailClient id={id} />;
}
