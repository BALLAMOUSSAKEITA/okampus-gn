"use client";

import { useState } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Bibliothèque de ressources
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Partage et accède à des TD, cours, sujets d'examens et corrections
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg font-medium hover:bg-[#a01828] transition-colors whitespace-nowrap"
            >
              + Partager une ressource
            </button>
          </div>

          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              Gagne de l'argent en partageant tes ressources de qualité
            </span>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
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
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{filteredResources.length}</span> ressource{filteredResources.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des ressources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">
                  {resource.category}
                </span>
                {resource.isPremium && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-md text-xs font-bold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>

              {/* Titre */}
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{resource.title}</h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{resource.description}</p>

              {/* Infos */}
              <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{resource.subject}</span>
                  {resource.year && <span>• {resource.year}</span>}
                </div>
                {resource.university && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {resource.university}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>{formatFileSize(resource.fileSize)}</span>
                  <span>• {resource.fileType.toUpperCase()}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {resource.rating}
                  </div>
                  <span>• {resource.downloads} téléchargements</span>
                </div>
                <div className="text-right">
                  {resource.price === 0 ? (
                    <button className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                      Gratuit
                    </button>
                  ) : (
                    <button className="px-4 py-1.5 bg-[#c41e3a] text-white rounded-lg text-xs font-bold hover:bg-[#a01828] transition-colors">
                      {(resource.price / 1000).toFixed(0)}k GNF
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Aucune ressource trouvée</p>
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link href="/" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Modal upload */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 md:p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Partager une ressource</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titre *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  placeholder="Ex: TD Analyse 1 - Limites et Continuité"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  placeholder="Décris brièvement le contenu de la ressource"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]">
                    <option>TD</option>
                    <option>Cours</option>
                    <option>Sujet</option>
                    <option>Correction</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Matière *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                    placeholder="Ex: Mathématiques"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filière</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                    placeholder="Ex: Sciences"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Année</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                    placeholder="Ex: L1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prix (GNF)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                    placeholder="0 = gratuit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fichier *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#c41e3a] transition-colors cursor-pointer">
                  <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-600">Cliquez pour sélectionner ou glissez le fichier</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOCX, PPTX (max 20 MB)</p>
                </div>
              </div>

              <button className="w-full py-3 bg-[#c41e3a] text-white rounded-lg font-medium hover:bg-[#a01828] transition-colors">
                Partager la ressource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
