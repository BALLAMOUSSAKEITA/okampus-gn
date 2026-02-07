"use client";

import { useState } from "react";
import Link from "next/link";

interface EntrepreneurProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "idea" | "in_progress" | "launched";
  teamSize: number;
  seeking?: string;
  website?: string;
  author: string;
  authorRole?: string;
  likes: number;
  views: number;
}

export default function EntrepreneuriatPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Données simulées
  const projects: EntrepreneurProject[] = [
    {
      id: "1",
      title: "GuinéaLearn",
      description: "Plateforme e-learning adaptée au contexte guinéen avec des cours en ligne, quiz interactifs et certificats. Objectif : démocratiser l'accès à l'éducation de qualité.",
      category: "EdTech",
      status: "in_progress",
      teamSize: 4,
      seeking: "Développeur frontend",
      website: "guinealearn.com",
      author: "Mamadou Diallo",
      authorRole: "Étudiant L3 Informatique",
      likes: 45,
      views: 234,
    },
    {
      id: "2",
      title: "AgroConnect",
      description: "Marketplace connectant directement les agriculteurs aux consommateurs. Réduction des intermédiaires, prix justes, livraison rapide. Focus sur produits locaux et bio.",
      category: "AgriTech",
      status: "launched",
      teamSize: 3,
      seeking: "Partenaires logistiques",
      author: "Fatoumata Camara",
      authorRole: "Entrepreneure",
      likes: 78,
      views: 456,
    },
    {
      id: "3",
      title: "HealthTrack GN",
      description: "Application mobile pour le suivi de santé : rappels médicaments, rendez-vous, carnets de vaccination. Collaboration avec hôpitaux guinéens.",
      category: "HealthTech",
      status: "idea",
      teamSize: 2,
      seeking: "Co-fondateur technique, financement seed",
      author: "Ibrahim Sylla",
      authorRole: "Étudiant Médecine",
      likes: 32,
      views: 189,
    },
    {
      id: "4",
      title: "KulturHub",
      description: "Plateforme de promotion de la culture guinéenne : artistes, événements, vente d'œuvres d'art, streaming concerts. Monétisation pour les créateurs locaux.",
      category: "Culture & Arts",
      status: "in_progress",
      teamSize: 5,
      seeking: "Partenaires culturels",
      website: "kulturhub.gn",
      author: "Aissatou Barry",
      authorRole: "Entrepreneure",
      likes: 56,
      views: 312,
    },
    {
      id: "5",
      title: "EcoRecycle GN",
      description: "Service de collecte et recyclage des déchets à Conakry. Application pour planifier les collectes, sensibilisation environnementale, partenariats avec entreprises.",
      category: "GreenTech",
      status: "launched",
      teamSize: 6,
      website: "ecorecycle.gn",
      author: "Ousmane Bah",
      authorRole: "Entrepreneur",
      likes: 91,
      views: 523,
    },
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchCategory = selectedCategory === "all" || proj.category === selectedCategory;
    const matchStatus = selectedStatus === "all" || proj.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  const statusLabels: Record<string, string> = {
    idea: "Idée",
    in_progress: "En cours",
    launched: "Lancé",
  };

  const statusColors: Record<string, string> = {
    idea: "bg-amber-50 text-amber-700 border-amber-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    launched: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Entrepreneuriat étudiant
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Découvre les projets innovants portés par des étudiants guinéens
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#c41e3a] text-white rounded-lg font-medium hover:bg-[#a01828] transition-colors whitespace-nowrap"
            >
              + Soumettre mon projet
            </button>
          </div>

          {/* Info box */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-violet-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Trouve des co-fondateurs, investisseurs ou collaborateurs
                </p>
                <p className="text-xs text-slate-600">
                  Partage ton projet, connecte-toi avec d'autres entrepreneurs étudiants et fais grandir ton idée
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              >
                <option value="all">Tous</option>
                <option value="idea">Idées</option>
                <option value="in_progress">En cours</option>
                <option value="launched">Lancés</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{filteredProjects.length}</span> projet{filteredProjects.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-md text-xs font-medium">
                    {project.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>

              {/* Titre */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{project.description}</p>

              {/* Seeking */}
              {project.seeking && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-900 mb-1">Recherche :</p>
                  <p className="text-sm text-amber-700">{project.seeking}</p>
                </div>
              )}

              {/* Infos */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{project.teamSize} membre{project.teamSize > 1 ? "s" : ""}</span>
                </div>
                {project.website && (
                  <a
                    href={`https://${project.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#c41e3a] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{project.website}</span>
                  </a>
                )}
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{project.author}</p>
                  {project.authorRole && (
                    <p className="text-xs text-slate-600">{project.authorRole}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {project.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {project.views}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Aucun projet trouvé</p>
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link href="/" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Modal création projet */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 md:p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Soumettre mon projet</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom du projet *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  placeholder="Ex: GuinéaLearn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  placeholder="Décris ton projet, sa mission, son impact..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie *</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]">
                    <option>EdTech</option>
                    <option>HealthTech</option>
                    <option>AgriTech</option>
                    <option>FinTech</option>
                    <option>GreenTech</option>
                    <option>Culture & Arts</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Statut *</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]">
                    <option value="idea">Idée</option>
                    <option value="in_progress">En cours</option>
                    <option value="launched">Lancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ce que je recherche</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  placeholder="Ex: Co-fondateur technique, financement, mentors..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Taille de l'équipe</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Site web</label>
                  <input
                    type="url"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a]"
                    placeholder="exemple.com"
                  />
                </div>
              </div>

              <button className="w-full py-3 bg-[#c41e3a] text-white rounded-lg font-medium hover:bg-[#a01828] transition-colors">
                Soumettre le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
