"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

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
    idea: "bg-amber-50 text-amber-600",
    in_progress: "bg-[#f4f4f8] text-[#121117]",
    launched: "bg-emerald-50 text-emerald-600",
  };

  return (
    <>
    <PageShell>
      <PageHeader
        eyebrow="Innovation"
        title="Entrepreneuriat etudiant"
        description="Decouvre les projets innovants portes par des etudiants"
        action={
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            + Soumettre mon projet
          </button>
        }
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

              {/* Author */}
              <div className="pt-5 border-t border-[#dcdce5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#121117] flex items-center justify-center text-white text-xs font-bold">
                    {project.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-[#121117] text-sm">{project.author}</p>
                    {project.authorRole && (
                      <p className="text-xs text-[#6a697c]">{project.authorRole}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#6a697c]">
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
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 rounded-lg bg-[#f4f4f8] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <p className="text-[#4d4c5c] font-medium">Aucun projet trouvé</p>
          </div>
        )}

        <div className="mt-10 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
    </PageShell>

      {/* Modal création projet */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div className="h-1 bg-[#121117] md:rounded-t-2xl" />

            <div className="p-6 md:p-8 border-b border-[#dcdce5] flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#121117]">Soumettre mon projet</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#6a697c] hover:text-[#4d4c5c] hover:bg-[#dcdce5] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Nom du projet *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  placeholder="Ex: GuinéaLearn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  placeholder="Décris ton projet, sa mission, son impact..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Catégorie *</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm">
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
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Statut *</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm">
                    <option value="idea">Idée</option>
                    <option value="in_progress">En cours</option>
                    <option value="launched">Lancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Ce que je recherche</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  placeholder="Ex: Co-fondateur technique, financement, mentors..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Taille de l'équipe</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Site web</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm"
                    placeholder="exemple.com"
                  />
                </div>
              </div>

              <button className="btn-primary">
                Soumettre le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
