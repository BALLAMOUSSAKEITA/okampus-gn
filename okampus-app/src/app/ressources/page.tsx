"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  filiere?: string;
  university?: string;
  year?: string;
  fileType: string;
  fileSize: number;
  price: number;
  isPremium: boolean;
  downloads: number;
  rating: number;
  author?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/resources`);
        if (!res.ok) throw new Error("Impossible de charger les ressources");
        const data = (await res.json()) as Array<{
          id: string;
          title: string;
          description: string;
          category: string;
          subject: string;
          filiere?: string | null;
          university?: string | null;
          year?: string | null;
          file_type: string;
          file_size: number;
          price: number;
          is_premium: boolean;
          downloads: number;
          rating: number;
        }>;
        setResources(
          data.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            category: r.category,
            subject: r.subject,
            filiere: r.filiere ?? undefined,
            university: r.university ?? undefined,
            year: r.year ?? undefined,
            fileType: r.file_type,
            fileSize: r.file_size,
            price: r.price,
            isPremium: r.is_premium,
            downloads: r.downloads,
            rating: r.rating,
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredResources = resources.filter((res) => {
    const matchCategory = selectedCategory === "all" || res.category === selectedCategory;
    const matchSubject = selectedSubject === "all" || res.subject === selectedSubject;
    const matchSearch =
      searchQuery === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSubject && matchSearch;
  });

  const subjects = useMemo(() => Array.from(new Set(resources.map((r) => r.subject))).sort(), [resources]);
  const categories = useMemo(() => Array.from(new Set(resources.map((r) => r.category))).sort(), [resources]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Bibliotheque"
        title="Bibliotheque de ressources"
        description="Partage et accede a des TD, cours, sujets d'examens et corrections"
      />

          <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#ffdf3d]/30 border border-[#dcdce5] rounded-lg mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#ffdf3d] flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-[#121117]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#4d4c5c]">
              Gagne de l&apos;argent en partageant tes ressources de qualite
            </span>
          </div>

        {/* Filtres */}
        <div className="card p-5 md:p-7 mb-8">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher une ressource..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
              >
                <option value="all">Tous</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
              >
                <option value="all">Toutes</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-[#4d4c5c]">
                <span className="font-bold text-[#121117]">{filteredResources.length}</span> ressource{filteredResources.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des ressources */}
        {loading ? (
          <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
        ) : fetchError ? (
          <EmptyState title="Erreur de chargement" description={fetchError} />
        ) : resources.length === 0 ? (
          <EmptyState
            title="Aucune ressource pour le moment"
            description="Les TD, cours et sujets seront publies ici des qu'ils seront disponibles."
          />
        ) : (
        <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="card p-6 hover:border-[#121117]/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-semibold">
                  {resource.category}
                </span>
                {resource.isPremium && (
                  <span className="px-3 py-1 bg-[#ffdf3d] text-[#121117] rounded-full text-xs font-bold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>

              {/* Titre */}
              <h3 className="font-bold text-[#121117] mb-2 line-clamp-2 group-hover:text-[#121117] transition-colors">{resource.title}</h3>
              <p className="text-sm text-[#4d4c5c] mb-4 line-clamp-2">{resource.description}</p>

              {/* Infos */}
              <div className="space-y-2 mb-5 text-xs text-[#4d4c5c]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-medium">{resource.subject}</span>
                  {resource.year && <span className="px-2 py-0.5 bg-[#f4f4f8] text-[#4d4c5c] rounded-full">{resource.year}</span>}
                </div>
                {resource.university && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {resource.university}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>{formatFileSize(resource.fileSize)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#dcdce5]" />
                  <span>{resource.fileType.toUpperCase()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#dcdce5] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#4d4c5c]">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-[#4d4c5c]">{resource.rating}</span>
                  </div>
                  <span className="text-[#6a697c]">{resource.downloads} telechargements</span>
                </div>
                <div className="text-right">
                  {resource.price === 0 ? (
                    <button className="btn-secondary px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors">
                      Gratuit
                    </button>
                  ) : (
                    <button className="btn-primary">
                      {(resource.price / 1000).toFixed(0)}k GNF
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && resources.length > 0 && (
          <EmptyState
            title="Aucune ressource avec ces criteres"
            description="Essaie de modifier tes filtres ou ta recherche."
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
