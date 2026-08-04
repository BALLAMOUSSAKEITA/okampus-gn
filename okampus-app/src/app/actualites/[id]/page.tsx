"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/api";
import { getSiteUrl } from "@/lib/share";
import ShareButtons from "@/components/ShareButtons";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

type NewsDetail = {
  id: string;
  title: string;
  summary: string;
  content?: string | null;
  link?: string | null;
  category: string;
  views: number;
  published_at: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  Actualité: "bg-[#dbeafe] text-[#1d4ed8]",
  Événement: "bg-[#ffedd5] text-[#c2410c]",
  Bourse: "bg-[#ede9fe] text-[#6d28d9]",
  Plateforme: "bg-[#dcfce7] text-[#15803d]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ActualiteDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/news/${id}?count_view=true`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Actualité introuvable");
        return r.json() as Promise<NewsDetail>;
      })
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [id]);

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/actualites/${id}`;
    }
    return `${getSiteUrl()}/actualites/${id}`;
  }, [id]);

  if (loading) {
    return (
      <PageShell>
        <p className="text-[#6a697c]">Chargement...</p>
      </PageShell>
    );
  }

  if (error || !item) {
    return (
      <PageShell>
        <PageHeader title="Actualité introuvable" />
        <p className="text-[#4d4c5c] mb-6">{error || "Cette actualité n'existe plus ou n'est plus disponible."}</p>
        <Link href="/" className="btn-primary inline-flex">
          Retour à l&apos;accueil
        </Link>
      </PageShell>
    );
  }

  const badgeClass = CATEGORY_STYLES[item.category] ?? "bg-[#f4f4f8] text-[#4d4c5c]";
  const paragraphs = (item.content || item.summary)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <PageShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#4d4c5c] hover:text-[#121117] mb-6"
      >
        ← Retour à l&apos;accueil
      </Link>

      <article className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${badgeClass}`}>
            {item.category}
          </span>
          <time className="text-sm text-[#6a697c]">{formatDate(item.published_at)}</time>
          <span className="text-sm text-[#6a697c]">
            {item.views} lecture{item.views !== 1 ? "s" : ""}
          </span>
        </div>

        <PageHeader title={item.title} />

        <p className="text-lg text-[#4d4c5c] leading-relaxed mb-6">{item.summary}</p>

        <ShareButtons url={shareUrl} title={item.title} className="mb-8" />

        <div className="card p-6 sm:p-8 bg-white space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[#4d4c5c] leading-relaxed whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {item.link && (
          <div className="mt-8">
            {item.link.startsWith("/") ? (
              <Link href={item.link} className="btn-primary inline-flex">
                {item.category === "Bourse" ? "Voir la fiche bourse complète" : "En savoir plus"}
              </Link>
            ) : (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex"
              >
                En savoir plus (lien externe)
              </a>
            )}
          </div>
        )}
      </article>
    </PageShell>
  );
}
