"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { API_URL, apiUpload, resolveFileUrl } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm transition-all";

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
  fileUrl: string;
  downloads: number;
  rating: number;
}

const defaultUploadForm = {
  title: "",
  description: "",
  category: "TD",
  subject: "",
  filiere: "",
  university: "",
  year: "",
};

export default function ResourcesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState(defaultUploadForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const loadResources = useCallback(async () => {
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
        file_url: string;
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
          fileUrl: r.file_url,
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
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

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
    if (bytes <= 0) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const openUploadModal = () => {
    if (!session?.user?.id) {
      router.push("/inscription?callbackUrl=/ressources");
      return;
    }
    setUploadError("");
    setSelectedFile(null);
    setShowUploadModal(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !uploadForm.title.trim()) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title.trim());
      formData.append("author_id", session.user.id);
      if (uploadForm.description.trim()) formData.append("description", uploadForm.description.trim());
      if (uploadForm.category) formData.append("category", uploadForm.category);
      if (uploadForm.subject.trim()) formData.append("subject", uploadForm.subject.trim());
      if (uploadForm.filiere.trim()) formData.append("filiere", uploadForm.filiere.trim());
      if (uploadForm.university.trim()) formData.append("university", uploadForm.university.trim());
      if (uploadForm.year.trim()) formData.append("year", uploadForm.year.trim());
      if (selectedFile) formData.append("file", selectedFile);

      const res = await apiUpload("/resources/upload", formData, session.accessToken);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const detail = (err as { detail?: string | Array<{ msg?: string }> }).detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
            ? detail.map((d) => d.msg).filter(Boolean).join(", ")
            : "Impossible de publier la ressource";
        throw new Error(message);
      }
      setShowUploadModal(false);
      setUploadForm(defaultUploadForm);
      setSelectedFile(null);
      await loadResources();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur lors de la publication");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <PageShell>
        <PageHeader
          eyebrow="Bibliotheque"
          title="Bibliotheque de ressources"
          description="Partage et accede gratuitement a des TD, cours et sujets d'examens"
          action={
            <button onClick={openUploadModal} className="btn-primary">
              + Partager une ressource
            </button>
          }
        />

        <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-100 rounded-lg mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[#4d4c5c]">
            Toutes les ressources sont gratuites — partage tes notes, TD et cours avec la communaute etudiante.
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
                className={inputClass}
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
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Matiere</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={inputClass}
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

        {loading ? (
          <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
        ) : fetchError ? (
          <EmptyState title="Erreur de chargement" description={fetchError} />
        ) : resources.length === 0 ? (
          <EmptyState
            title="Aucune ressource pour le moment"
            description="Sois le premier a partager un TD, un cours ou un sujet d'examen."
            action={
              <button onClick={openUploadModal} className="btn-primary">
                Partager une ressource
              </button>
            }
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="card p-6 hover:border-[#121117]/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-semibold">
                      {resource.category}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                      Gratuit
                    </span>
                  </div>

                  <h3 className="font-bold text-[#121117] mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-[#4d4c5c] mb-4 line-clamp-2">{resource.description}</p>

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

                  <div className="pt-4 border-t border-[#dcdce5] flex items-center justify-between">
                    <span className="text-xs text-[#6a697c]">{resource.downloads} telechargement{resource.downloads > 1 ? "s" : ""}</span>
                    {resource.fileUrl ? (
                      <a
                        href={resolveFileUrl(resource.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary px-4 py-1.5 text-xs font-bold"
                      >
                        Telecharger
                      </a>
                    ) : (
                      <span className="text-xs text-[#6a697c]">Lien indisponible</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <EmptyState
                title="Aucune ressource avec ces criteres"
                description="Essaie de modifier tes filtres ou ta recherche."
              />
            )}
          </>
        )}

        <div className="mt-10 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour a l&apos;accueil
          </Link>
        </div>
      </PageShell>

      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => !uploading && setShowUploadModal(false)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-[#121117] md:rounded-t-2xl" />
            <div className="p-6 md:p-8 border-b border-[#dcdce5] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#121117]">Partager une ressource</h3>
                <p className="text-sm text-[#4d4c5c] mt-1">Publication gratuite pour toute la communaute</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="w-8 h-8 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#6a697c] hover:bg-[#dcdce5] transition-all"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 md:p-8 space-y-5">
              {uploadError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{uploadError}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Titre *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Ex: TD Analyse 1 - Limites et continuite"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Description</label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Decris brievement le contenu de la ressource"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className={inputClass}
                  >
                    <option>TD</option>
                    <option>Cours</option>
                    <option>Sujet</option>
                    <option>Correction</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Matiere</label>
                  <input
                    type="text"
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    placeholder="Ex: Mathematiques"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Filiere</label>
                  <input
                    type="text"
                    value={uploadForm.filiere}
                    onChange={(e) => setUploadForm({ ...uploadForm, filiere: e.target.value })}
                    placeholder="Ex: Sciences"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Universite</label>
                  <input
                    type="text"
                    value={uploadForm.university}
                    onChange={(e) => setUploadForm({ ...uploadForm, university: e.target.value })}
                    placeholder="Ex: UGANC"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Annee</label>
                  <input
                    type="text"
                    value={uploadForm.year}
                    onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })}
                    placeholder="Ex: L1"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Fichier</label>
                <label className="border-2 border-dashed border-[#dcdce5] rounded-lg p-8 text-center hover:border-[#121117] hover:bg-[#f4f4f8]/30 transition-all cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp"
                    className="sr-only"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="w-12 h-12 rounded-lg bg-[#f4f4f8] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {selectedFile ? (
                    <p className="text-sm font-medium text-[#121117]">{selectedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-[#4d4c5c] font-medium">Clique pour selectionner un fichier</p>
                      <p className="text-xs text-[#6a697c] mt-1.5">PDF, DOCX, PPTX, images (max 20 Mo)</p>
                    </>
                  )}
                </label>
              </div>

              <button type="submit" disabled={uploading || !uploadForm.title.trim()} className="btn-primary w-full">
                {uploading ? "Publication..." : "Partager la ressource"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
