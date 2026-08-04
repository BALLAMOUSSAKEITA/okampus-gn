import type { Metadata } from "next";
import ScholarshipDetailClient from "./ScholarshipDetail";

const API =
  process.env.API_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:8000";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.NEXTAUTH_URL?.trim() ||
  "https://www.bachelio.com";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API}/scholarships/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "Bourse introuvable | BacheliO" };
    const s = (await res.json()) as { title: string; description: string };
    const url = `${SITE}/bourses/${id}`;
    return {
      title: `${s.title} | BacheliO`,
      description: s.description,
      openGraph: {
        title: s.title,
        description: s.description,
        url,
        type: "article",
        siteName: "BacheliO",
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
