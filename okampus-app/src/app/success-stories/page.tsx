"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import UserAvatar from "@/components/UserAvatar";

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
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/success-stories`);
        if (!res.ok) throw new Error("Impossible de charger les stories");
        const data = (await res.json()) as Array<{
          id: string;
          title: string;
          content: string;
          category: string;
          author_name: string;
          author_role?: string | null;
          university?: string | null;
          graduation_year?: string | null;
          image_url?: string | null;
          likes: number;
          views: number;
          is_featured: boolean;
        }>;
        setStories(
          data.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.content,
            category: s.category,
            authorName: s.author_name,
            authorRole: s.author_role ?? "",
            university: s.university ?? undefined,
            graduationYear: s.graduation_year ?? undefined,
            imageUrl: s.image_url ?? undefined,
            likes: s.likes,
            views: s.views,
            isFeatured: s.is_featured,
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryLabels: Record<string, string> = {
    Orientation: "Orientation",
    Etudes: "Etudes",
    Carriere: "Carriere",
    Entrepreneuriat: "Entrepreneuriat",
    Autre: "Autre",
  };

  const categories = useMemo(
    () => Array.from(new Set(stories.map((s) => s.category))).sort(),
    [stories]
  );

  const filteredStories = stories.filter((story) => {
    if (selectedCategory === "all") return true;
    return story.category === selectedCategory;
  });

  const featuredStories = filteredStories.filter((s) => s.isFeatured);
  const regularStories = filteredStories.filter((s) => !s.isFeatured);

  if (loading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Success Stories" title="Parcours inspirants" description="Inspire-toi des parcours exceptionnels d'anciens etudiants" centered />
        <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
      </PageShell>
    );
  }

  if (fetchError) {
    return (
      <PageShell>
        <PageHeader eyebrow="Success Stories" title="Parcours inspirants" centered />
        <EmptyState title="Erreur de chargement" description={fetchError} />
      </PageShell>
    );
  }

  if (stories.length === 0) {
    return (
      <PageShell>
        <PageHeader eyebrow="Success Stories" title="Parcours inspirants" description="Inspire-toi des parcours exceptionnels d'anciens etudiants" centered />
        <EmptyState
          title="Aucune success story pour le moment"
          description="Les temoignages seront publies ici des qu'ils seront disponibles."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Success Stories"
        title="Parcours inspirants"
        description="Inspire-toi des parcours exceptionnels d'anciens etudiants"
        centered
      />

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-[#121117] text-white"
                : "bg-white border border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117] hover:text-[#121117]"
            }`}
          >
            Toutes
          </button>
          {Object.entries(categoryLabels)
            .filter(([key]) => categories.includes(key))
            .map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === key
                  ? "bg-[#121117] text-white"
                  : "bg-white border border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117] hover:text-[#121117]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#121117] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Stories à la une
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <div
                  key={story.id}
                  className="card p-6 hover:-translate-y-1 hover:border-[#121117]/30 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#121117]" />

                  {/* Achievement badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-[#dcdce5] rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <UserAvatar name={story.authorName} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#121117] truncate">{story.authorName}</p>
                      <p className="text-xs text-[#6a697c] truncate">{story.authorRole}</p>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-semibold mb-3">
                    {categoryLabels[story.category] ?? story.category}
                  </span>

                  <h3 className="text-lg font-bold text-[#121117] mb-3 line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Testimonial quote styling */}
                  <div className="relative pl-4 border-l-2 border-[#dcdce5] mb-4">
                    <p className="text-sm text-[#4d4c5c] leading-relaxed line-clamp-4 italic">
                      {story.content}
                    </p>
                  </div>

                  {story.university && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6a697c] mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {story.university} &middot; Promo {story.graduationYear}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#dcdce5] text-sm text-[#6a697c]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#121117]" fill="currentColor" viewBox="0 0 20 20">
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
                    <button className="btn-secondary text-sm">
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
            <h2 className="text-xl font-bold text-[#121117] mb-6">Toutes les stories</h2>
            <div className="space-y-5">
              {regularStories.map((story) => (
                <div
                  key={story.id}
                  className="card p-5 md:p-6 hover:border-[#121117]/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <UserAvatar name={story.authorName} size={64} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-semibold">
                          {categoryLabels[story.category] ?? story.category}
                        </span>
                        {story.university && story.graduationYear && (
                          <span className="flex items-center gap-1 text-xs text-[#6a697c]">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            {story.university} &middot; Promo {story.graduationYear}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-[#121117] mb-2">
                        {story.title}
                      </h3>

                      <div className="mb-3">
                        <p className="font-semibold text-[#121117] text-sm">{story.authorName}</p>
                        <p className="text-xs text-[#6a697c]">{story.authorRole}</p>
                      </div>

                      {/* Testimonial quote styling */}
                      <div className="relative pl-4 border-l-2 border-[#dcdce5] mb-4">
                        <p className="text-sm text-[#4d4c5c] leading-relaxed line-clamp-3 italic">
                          {story.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-[#6a697c]">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#121117]" fill="currentColor" viewBox="0 0 20 20">
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
                        <button className="btn-secondary text-sm">
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
          <EmptyState
            title="Aucune story avec cette categorie"
            description="Essaie une autre categorie."
          />
        )}

        {/* CTA */}
        <div className="mt-16 bg-[#121117] rounded-lg p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Tu as une belle histoire à raconter ?
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Partage ton parcours et inspire la prochaine generation d&apos;etudiants
            </p>
            <button className="btn-secondary bg-white text-[#121117] border-white">
              Partager mon histoire
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
    </PageShell>
  );
}
