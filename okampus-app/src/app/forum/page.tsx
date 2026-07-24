"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { API_URL } from "@/lib/api";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  date: string;
  replies: number;
  views: number;
}

const categories = ["Toutes", "Orientation", "Etudes", "Stages", "Vie etudiante", "Autre"];

const categoryColors: Record<string, string> = {
  Orientation: "bg-[#ffdf3d]/40 text-[#121117] border-[#dcdce5]",
  Etudes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Stages: "bg-amber-50 text-amber-700 border-[#dcdce5]",
  "Vie etudiante": "bg-violet-50 text-violet-700 border-violet-200",
  Autre: "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) return `Il y a ${Math.max(1, diffHours)}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/forum`);
        if (!res.ok) throw new Error("Impossible de charger le forum");
        const data = (await res.json()) as Array<{
          id: string;
          title: string;
          content: string;
          author: string;
          category: string;
          replies: number;
          views: number;
          created_at: string;
        }>;
        setPosts(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            author: p.author,
            category: p.category,
            replies: p.replies,
            views: p.views,
            date: formatDate(p.created_at),
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchCategory = selectedCategory === "Toutes" || post.category === selectedCategory;
        const matchSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [posts, selectedCategory, searchQuery]
  );

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="Communaute"
        title="Forum"
        description="Pose tes questions sur les universites et les filieres"
      />

      <div className="flex flex-col gap-4 mb-8 md:mb-10">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#121117] text-white"
                    : "bg-white border border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117]/30 hover:text-[#121117]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
      ) : fetchError ? (
        <EmptyState title="Erreur de chargement" description={fetchError} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Aucune discussion pour le moment"
          description="Le forum sera alimente par la communaute. Reviens bientot."
        />
      ) : (
        <>
          <div className="space-y-3 md:space-y-4">
            {filteredPosts.map((post) => (
              <article key={post.id} className="card p-5 md:p-6 group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryColors[post.category] || "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]"}`}>
                        {post.category}
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-[#121117] mb-2 leading-snug">{post.title}</h3>
                      <p className="text-sm text-[#4d4c5c] line-clamp-2 leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs md:text-sm text-[#6a697c] pt-3 border-t border-[#dcdce5]/80">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-[#4d4c5c]">{post.author}</span>
                      <span className="text-[#dcdce5]">·</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#6a697c]">
                      <span className="flex items-center gap-1.5">{post.replies} reponses</span>
                      <span className="flex items-center gap-1.5">{post.views} vues</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <EmptyState
              title="Aucune question avec ces criteres"
              description="Essaie de modifier ta recherche ou la categorie."
            />
          )}
        </>
      )}
    </PageShell>
  );
}
