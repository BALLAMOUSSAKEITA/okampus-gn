"use client";

import { useState } from "react";
import Link from "next/link";

interface SuccessStory {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  university?: string;
  graduationYear?: string;
  imageUrl?: string;
  likes: number;
  views: number;
  isFeatured: boolean;
}

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Données simulées
  const stories: SuccessStory[] = [
    {
      id: "1",
      title: "De l'UGANC à Google : mon parcours d'ingénieur logiciel",
      content: "Après mon bac en 2015, j'ai intégré l'UGANC en informatique. Grâce à l'accompagnement de mes professeurs et à ma passion pour le code, j'ai décroché un stage chez une startup en Afrique du Sud. Aujourd'hui, je travaille comme Software Engineer chez Google à Zurich. Mon conseil : travaillez dur, saisissez chaque opportunité et n'ayez pas peur de rêver grand. La Guinée regorge de talents !",
      category: "Career",
      authorName: "Mamadou Diallo",
      authorRole: "Software Engineer chez Google",
      university: "UGANC",
      graduationYear: "2019",
      likes: 234,
      views: 1567,
      isFeatured: true,
    },
    {
      id: "2",
      title: "Comment j'ai créé la première startup EdTech guinéenne",
      content: "En 3ème année à l'IPG, j'ai remarqué que beaucoup d'étudiants peinaient à accéder à des ressources pédagogiques de qualité. J'ai alors créé GuinéaLearn avec 3 amis. Aujourd'hui, notre plateforme compte plus de 10 000 utilisateurs et nous avons levé 50 000 $ en seed. Entrepreneuriat étudiant, c'est possible en Guinée !",
      category: "Entrepreneur",
      authorName: "Fatoumata Camara",
      authorRole: "CEO de GuinéaLearn",
      university: "IPG",
      graduationYear: "2022",
      likes: 189,
      views: 892,
      isFeatured: true,
    },
    {
      id: "3",
      title: "De la médecine rurale à l'OMS : mon engagement pour la santé",
      content: "Après mes études à la FMPOS, j'ai travaillé 2 ans dans un hôpital rural en Guinée forestière. Cette expérience m'a ouvert les yeux sur les défis sanitaires du pays. J'ai ensuite obtenu un Master en Santé Publique en France, puis rejoint l'OMS à Genève où je coordonne des programmes de vaccination en Afrique. Mon rêve : améliorer la santé de millions d'Africains.",
      category: "Academic",
      authorName: "Dr Ibrahim Sylla",
      authorRole: "Coordinateur de programmes à l'OMS",
      university: "FMPOS",
      graduationYear: "2018",
      likes: 312,
      views: 1234,
      isFeatured: true,
    },
    {
      id: "4",
      title: "Première Guinéenne ingénieure chez Total Energies",
      content: "Mon parcours n'a pas été facile en tant que femme dans l'ingénierie pétrolière. Mais j'ai persévéré. Diplômée de Polytechnique Conakry, j'ai continué en Master en France puis rejoint Total Energies. Aujourd'hui je manage une équipe de 20 ingénieurs sur des projets offshore. Aux jeunes filles : vous pouvez tout accomplir !",
      category: "Career",
      authorName: "Aissatou Barry",
      authorRole: "Ingénieure Senior chez Total Energies",
      university: "Polytechnique Conakry",
      graduationYear: "2017",
      likes: 267,
      views: 1045,
      isFeatured: false,
    },
    {
      id: "5",
      title: "Comment j'ai gagné le Concours d'Éloquence Africain",
      content: "Étudiant en droit à l'Université Gamal Abdel Nasser, j'ai toujours aimé débattre. En 2023, j'ai participé au Concours d'Éloquence Panafricain et remporté le premier prix face à 300 candidats de 20 pays. Cette victoire m'a ouvert les portes d'un stage à l'Union Africaine. Travaillez votre expression orale, c'est une compétence clé !",
      category: "Academic",
      authorName: "Ousmane Bah",
      authorRole: "Juriste stagiaire à l'Union Africaine",
      university: "UGANC",
      graduationYear: "2024",
      likes: 145,
      views: 678,
      isFeatured: false,
    },
  ];

  const filteredStories = stories.filter((story) => {
    if (selectedCategory === "all") return true;
    return story.category === selectedCategory;
  });

  const featuredStories = filteredStories.filter((s) => s.isFeatured);
  const regularStories = filteredStories.filter((s) => !s.isFeatured);

  const categoryLabels: Record<string, string> = {
    Academic: "Académique",
    Career: "Carrière",
    Entrepreneur: "Entrepreneuriat",
    Other: "Autre",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <span className="inline-block px-3 py-1 bg-red-50 text-[#c41e3a] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
            Success Stories
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Parcours inspirants
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            Inspire-toi des parcours exceptionnels d&apos;anciens étudiants guinéens
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-[#c41e3a] text-white shadow-md shadow-red-200"
                : "bg-white border border-slate-200 text-slate-600 hover:border-[#c41e3a] hover:text-[#c41e3a]"
            }`}
          >
            Toutes
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === key
                  ? "bg-[#c41e3a] text-white shadow-md shadow-red-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#c41e3a] hover:text-[#c41e3a]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Stories à la une
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <div
                  key={story.id}
                  className="card bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-br from-[#c41e3a] to-[#9e1830]" />

                  {/* Achievement badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-red-200">
                      {story.authorName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{story.authorName}</p>
                      <p className="text-xs text-slate-400 truncate">{story.authorRole}</p>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-1 bg-red-50 text-[#c41e3a] rounded-full text-xs font-semibold mb-3">
                    {categoryLabels[story.category]}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Testimonial quote styling */}
                  <div className="relative pl-4 border-l-2 border-red-200 mb-4">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 italic">
                      {story.content}
                    </p>
                  </div>

                  {story.university && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {story.university} &middot; Promo {story.graduationYear}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {story.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {story.views}
                      </div>
                    </div>
                    <button className="btn-primary text-[#c41e3a] font-semibold hover:text-[#9e1830] transition-colors">
                      Lire plus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Stories */}
        {regularStories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Toutes les stories</h2>
            <div className="space-y-5">
              {regularStories.map((story) => (
                <div
                  key={story.id}
                  className="card bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-red-100 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-red-200">
                        {story.authorName.charAt(0)}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-red-50 text-[#c41e3a] rounded-full text-xs font-semibold">
                          {categoryLabels[story.category]}
                        </span>
                        {story.university && story.graduationYear && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            {story.university} &middot; Promo {story.graduationYear}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                        {story.title}
                      </h3>

                      <div className="mb-3">
                        <p className="font-semibold text-slate-900 text-sm">{story.authorName}</p>
                        <p className="text-xs text-slate-400">{story.authorRole}</p>
                      </div>

                      {/* Testimonial quote styling */}
                      <div className="relative pl-4 border-l-2 border-red-200 mb-4">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 italic">
                          {story.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#c41e3a]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {story.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {story.views}
                          </div>
                        </div>
                        <button className="btn-primary text-[#c41e3a] font-semibold hover:text-[#9e1830] transition-colors text-sm">
                          Lire l&apos;histoire complète
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredStories.length === 0 && (
          <div className="card bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-600">Aucune story trouvée</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#c41e3a] to-[#9e1830] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Tu as une belle histoire à raconter ?
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Partage ton parcours et inspire la prochaine génération d&apos;étudiants guinéens
            </p>
            <button className="btn-primary px-8 py-3 bg-white text-[#c41e3a] rounded-full font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg shadow-red-900/20 hover:shadow-xl">
              Partager mon histoire
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm">
          <Link href="/" className="text-slate-400 hover:text-[#c41e3a] font-medium transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
