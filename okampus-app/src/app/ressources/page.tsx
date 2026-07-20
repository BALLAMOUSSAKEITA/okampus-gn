"use client";

import { useState } from "react";
import Link from "next/link";
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
  author: string;
}

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Données simulées
  const resources: Resource[] = [
    {
      id: "1",
      title: "TD Analyse 1 - Limites et Continuité",
      description: "Série de 15 exercices corrigés sur les limites, continuité et dérivées",
      category: "TD",
      subject: "Mathématiques",
      filiere: "Sciences",
      university: "UGANC",
      year: "L1",
      fileType: "pdf",
      fileSize: 2500000,
      price: 5000,
      isPremium: false,
      downloads: 234,
      rating: 4.5,
      author: "Mamadou Diallo",
    },
    {
      id: "2",
      title: "Cours Complet Algorithmique",
      description: "Cours détaillé avec exemples en Python et C",
      category: "Cours",
      subject: "Informatique",
      filiere: "Informatique",
      university: "UGANC",
      year: "L1",
      fileType: "pdf",
      fileSize: 8500000,
      price: 10000,
      isPremium: true,
      downloads: 456,
      rating: 4.8,
      author: "Fatoumata Camara",
    },
    {
      id: "3",
      title: "Sujet Examen Physique 2023",
      description: "Sujet d'examen session normale avec corrigé détaillé",
      category: "Sujet",
      subject: "Physique",
      filiere: "Sciences",
      university: "IPG",
      year: "L2",
      fileType: "pdf",
      fileSize: 1200000,
      price: 3000,
      isPremium: false,
      downloads: 189,
      rating: 4.2,
      author: "Ibrahim Sylla",
    },
    {
      id: "4",
      title: "Résumé Biochimie Métabolisme",
      description: "Fiche de révision complète sur le métabolisme",
      category: "Cours",
      subject: "Biochimie",
      filiere: "Médecine",
      university: "FMPOS",
      year: "L2",
      fileType: "pdf",
      fileSize: 3500000,
      price: 7000,
      isPremium: true,
      downloads: 312,
      rating: 4.7,
      author: "Aissatou Barry",
    },
  ];

  const filteredResources = resources.filter((res) => {
    const matchCategory = selectedCategory === "all" || res.category === selectedCategory;
    const matchSubject = selectedSubject === "all" || res.subject === selectedSubject;
    const matchSearch =
      searchQuery === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSubject && matchSearch;
  });

  const subjects = Array.from(new Set(resources.map((r) => r.subject)));
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
    <PageShell>
      <PageHeader
        eyebrow="Bibliotheque"
        title="Bibliotheque de ressources"
        description="Partage et accede a des TD, cours, sujets d'examens et corrections"
        action={
          <button onClick={() => setShowUploadModal(true)} className="btn-primary">
            + Partager une ressource
          </button>
        }
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

        {filteredResources.length === 0 && (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 rounded-lg bg-[#f4f4f8] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-[#4d4c5c] font-medium">Aucune ressource trouvée</p>
          </div>
        )}

        <div className="mt-10 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
    </PageShell>

      {/* Modal upload */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div className="h-1 bg-[#121117] md:rounded-t-2xl" />

            <div className="p-6 md:p-8 border-b border-[#dcdce5] flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#121117]">Partager une ressource</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#6a697c] hover:text-[#4d4c5c] hover:bg-[#dcdce5] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Titre *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  placeholder="Ex: TD Analyse 1 - Limites et Continuité"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Description *</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  placeholder="Décris brièvement le contenu de la ressource"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type *</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm">
                    <option>TD</option>
                    <option>Cours</option>
                    <option>Sujet</option>
                    <option>Correction</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Matière *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                    placeholder="Ex: Mathématiques"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Filière</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                    placeholder="Ex: Sciences"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Année</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                    placeholder="Ex: L1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Prix (GNF)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                    placeholder="0 = gratuit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Fichier *</label>
                <div className="border-2 border-dashed border-[#dcdce5] rounded-lg p-10 text-center hover:border-[#121117] hover:bg-[#f4f4f8]/30 transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-lg bg-[#f4f4f8] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#f4f4f8] transition-colors">
                    <svg className="w-7 h-7 text-[#121117] group-hover:text-[#121117] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#4d4c5c] font-medium">Cliquez pour sélectionner ou glissez le fichier</p>
                  <p className="text-xs text-[#6a697c] mt-1.5">PDF, DOCX, PPTX (max 20 MB)</p>
                </div>
              </div>

              <button className="btn-primary">
                Partager la ressource
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
