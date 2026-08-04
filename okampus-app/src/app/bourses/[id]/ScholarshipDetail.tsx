"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { getSiteUrl } from "@/lib/share";
import ShareButtons from "@/components/ShareButtons";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

type ScholarshipDetail = {
  id: string;
  title: string;
  type: string;
  organization: string;
  description: string;
  content?: string | null;
  eligibility?: string | null;
  amount?: string | null;
  deadline?: string | null;
  apply_link?: string | null;
  contact_info?: string | null;
  domain?: string | null;
  location?: string | null;
  views: number;
};

function formatDeadline(dateStr?: string | null) {
  if (!dateStr) return "Non spécifiée";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ScholarshipDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<ScholarshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/scholarships/${id}?count_view=true`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Bourse introuvable");
        return r.json() as Promise<ScholarshipDetail>;
      })
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [id]);

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/bourses/${id}`;
    }
    return `${getSiteUrl()}/bourses/${id}`;
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
        <EmptyState title="Bourse introuvable" description={error || "Cette opportunité n'est plus disponible."} />
        <Link href="/bourses" className="btn-primary inline-flex mt-6">
          Voir toutes les bourses
        </Link>
      </PageShell>
    );
  }

  const paragraphs = (item.content || item.description)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const eligibilityLines = item.eligibility
    ? item.eligibility.split("\n").map((l) => l.trim()).filter(Boolean)
    : [];

  return (
    <PageShell>
      <Link
        href="/bourses"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#4d4c5c] hover:text-[#121117] mb-6"
      >
        ← Retour aux bourses
      </Link>

      <article className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
            {item.type}
          </span>
          {item.location && (
            <span className="px-3 py-1.5 bg-[#f4f4f8] text-[#4d4c5c] rounded-full text-xs font-semibold">
              {item.location}
            </span>
          )}
          <span className="text-sm text-[#6a697c]">{item.views} lecture{item.views !== 1 ? "s" : ""}</span>
        </div>

        <PageHeader title={item.title} />
        <p className="text-lg font-medium text-[#4d4c5c] mb-2">{item.organization}</p>
        <p className="text-[#4d4c5c] leading-relaxed mb-6">{item.description}</p>

        <ShareButtons url={shareUrl} title={item.title} className="mb-8" />

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {item.amount && (
            <div className="card p-4 bg-emerald-50/50">
              <p className="text-xs font-semibold text-[#4d4c5c] uppercase">Montant</p>
              <p className="mt-1 font-semibold text-emerald-700">{item.amount}</p>
            </div>
          )}
          {item.deadline && (
            <div className="card p-4">
              <p className="text-xs font-semibold text-[#4d4c5c] uppercase">Date limite</p>
              <p className="mt-1 font-semibold text-[#121117]">{formatDeadline(item.deadline)}</p>
            </div>
          )}
          {item.domain && (
            <div className="card p-4">
              <p className="text-xs font-semibold text-[#4d4c5c] uppercase">Niveau</p>
              <p className="mt-1 font-semibold text-[#121117]">{item.domain}</p>
            </div>
          )}
        </div>

        <div className="card p-6 sm:p-8 bg-white space-y-5 mb-8">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[#4d4c5c] leading-relaxed whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {eligibilityLines.length > 0 && (
          <div className="card p-6 sm:p-8 mb-8">
            <h2 className="font-display text-xl font-bold text-[#121117] mb-4">Éligibilité</h2>
            <ul className="space-y-2">
              {eligibilityLines.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-[#4d4c5c] text-sm">
                  <span className="text-[#14b887] font-bold">•</span>
                  <span>{line.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {item.apply_link && (
            <a
              href={item.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Site officiel
            </a>
          )}
          {item.contact_info && (
            <a
              href={item.contact_info.includes("@") ? `mailto:${item.contact_info}` : item.contact_info}
              className="btn-secondary"
            >
              Contacter
            </a>
          )}
        </div>
      </article>
    </PageShell>
  );
}
