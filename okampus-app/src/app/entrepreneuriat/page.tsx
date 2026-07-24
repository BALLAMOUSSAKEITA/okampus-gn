"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

interface EntrepreneurProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  teamSize: number;
  seeking?: string;
  website?: string;
  likes: number;
  views: number;
}

function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("lanc")) return "launched";
  if (s.includes("cours") || s.includes("progress")) return "in_progress";
  return "idea";
}

export default function EntrepreneuriatPage() {
  const [projects, setProjects] = useState<EntrepreneurProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/entrepreneur`);
        if (!res.ok) throw new Error("Impossible de charger les projets");
        const data = (await res.json()) as Array<{
          id: string;
          title: string;
          description: string;
          category: string;
          status: string;
          team_size: number;
          seeking?: string | null;
          website?: string | null;
          likes: number;
          views: number;
        }>;
        setProjects(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            status: normalizeStatus(p.status),
            teamSize: p.team_size,
            seeking: p.seeking ?? undefined,
            website: p.website ?? undefined,
            likes: p.likes,
            views: p.views,
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProjects = projects.filter((proj) => {
    const matchCategory = selectedCategory === "all" || proj.category === selectedCategory;
    const matchStatus = selectedStatus === "all" || proj.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))).sort(), [projects]);

  const statusLabels: Record<string, string> = {
    idea: "Idee",
    in_progress: "En cours",
    launched: "Lance",
  };

  const statusColors: Record<string, string> = {
    idea: "bg-amber-50 text-amber-600",
    in_progress: "bg-[#f4f4f8] text-[#121117]",
    launched: "bg-emerald-50 text-emerald-600",
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Innovation"
        title="Entrepreneuriat etudiant"
        description="Decouvre les projets innovants portes par des etudiants"
      />

          <div className="card p-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#ffdf3d] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#121117]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#121117] mb-1">
                  Trouve des co-fondateurs, investisseurs ou collaborateurs
                </p>
                <p className="text-xs text-[#4d4c5c] leading-relaxed">
                  Partage ton projet, connecte-toi avec d'autres entrepreneurs étudiants et fais grandir ton idée
                </p>
              </div>
            </div>
          </div>

        {/* Filtres */}
        <div className="card p-5 md:p-7 mb-8">
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
              >
                <option value="all">Toutes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
              >
                <option value="all">Tous</option>
                <option value="idea">Idées</option>
                <option value="in_progress">En cours</option>
                <option value="launched">Lancés</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-[#4d4c5c]">
                <span className="font-bold text-[#121117]">{filteredProjects.length}</span> projet{filteredProjects.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        {loading ? (
          <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
        ) : fetchError ? (
          <EmptyState title="Erreur de chargement" description={fetchError} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="Aucun projet pour le moment"
            description="Les projets etudiants seront publies ici des qu'ils seront disponibles."
          />
        ) : (
        <>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card p-7 hover:border-[#121117]/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-violet-50 text-[#4d4c5c] rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>

              {/* Titre */}
              <h3 className="text-xl font-bold text-[#121117] mb-2 group-hover:text-[#121117] transition-colors">{project.title}</h3>
              <p className="text-sm text-[#4d4c5c] leading-relaxed mb-5">{project.description}</p>

              {/* Seeking */}
              {project.seeking && (
                <div className="mb-5 p-4 bg-amber-50/60 border border-amber-100 rounded-xl">
                  <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wider">Recherche :</p>
                  <p className="text-sm text-amber-600">{project.seeking}</p>
                </div>
              )}

              {/* Infos */}
              <div className="flex flex-wrap gap-4 mb-5 text-sm text-[#4d4c5c]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{project.teamSize} membre{project.teamSize > 1 ? "s" : ""}</span>
                </div>
                {project.website && (
                  <a
                    href={`https://${project.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#121117] hover:text-[#4d4c5c] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{project.website}</span>
                  </a>
                )}
              </div>

              <div className="pt-5 border-t border-[#dcdce5] flex items-center justify-end gap-4 text-sm text-[#6a697c]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-[#4d4c5c]">{project.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium text-[#4d4c5c]">{project.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && projects.length > 0 && (
          <EmptyState
            title="Aucun projet avec ces criteres"
            description="Essaie de modifier tes filtres."
          />
        )}
        </>
        )}

        <div className="mt-10 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
    </PageShell>
  );
}

