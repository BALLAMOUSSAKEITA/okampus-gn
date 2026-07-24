"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { API_URL, apiFetch } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const inputClass =
  "w-full px-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  date: string;
  replies: number;
  views: number;
  likes: number;
  likedByMe: boolean;
}

const categories = ["Toutes", "Orientation", "Etudes", "Stages", "Vie etudiante", "Autre"];
const postCategories = categories.filter((c) => c !== "Toutes");

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
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Etudes");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = session?.accessToken
        ? await apiFetch("/forum", { token: session.accessToken })
        : await fetch(`${API_URL}/forum`);
      if (!res.ok) throw new Error("Impossible de charger le forum");
      const data = (await res.json()) as Array<{
        id: string;
        title: string;
        content: string;
        author: string;
        category: string;
        replies: number;
        views: number;
        likes: number;
        liked_by_me: boolean;
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
          likes: p.likes ?? 0,
          likedByMe: p.liked_by_me ?? false,
          date: formatDate(p.created_at),
        }))
      );
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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

  const openNewPost = () => {
    if (!session?.user?.id) {
      router.push("/inscription?callbackUrl=/forum");
      return;
    }
    setCreateError("");
    setShowNewPost(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !newTitle.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await apiFetch("/forum", {
        method: "POST",
        token: session.accessToken,
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? "Impossible de publier");
      }
      const created = await res.json();
      setShowNewPost(false);
      setNewTitle("");
      setNewContent("");
      router.push(`/forum/${created.id}`);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Erreur lors de la publication");
    } finally {
      setCreating(false);
    }
  };

  const toggleLike = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.accessToken) {
      router.push("/inscription?callbackUrl=/forum");
      return;
    }
    try {
      const res = await apiFetch(`/forum/${postId}/like`, {
        method: "POST",
        token: session.accessToken,
      });
      if (!res.ok) return;
      const data = (await res.json()) as { liked: boolean; likes: number };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: data.likes, likedByMe: data.liked } : p
        )
      );
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <PageShell narrow>
        <PageHeader
          eyebrow="Communaute"
          title="Forum"
          description="Pose tes questions, partage ton experience et echange avec la communaute"
          action={
            <button onClick={openNewPost} className="btn-primary inline-flex items-center gap-2">
              + Nouvelle discussion
            </button>
          }
        />

        <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#f4f4f8] border border-[#dcdce5] rounded-lg mb-8">
          <span className="text-sm text-[#4d4c5c]">
            Ouvre une discussion, reponds aux autres et like les sujets utiles.
          </span>
        </div>

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
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all"
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
            description="Sois le premier a lancer une conversation."
            action={
              <button onClick={openNewPost} className="btn-primary">
                Ouvrir une discussion
              </button>
            }
          />
        ) : (
          <>
            <div className="space-y-3 md:space-y-4">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/forum/${post.id}`} className="block">
                  <article className="card p-5 md:p-6 group hover:border-[#121117]/30 transition-all">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryColors[post.category] || "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]"}`}>
                          {post.category}
                        </span>
                        <h3 className="text-base md:text-lg font-semibold text-[#121117] mb-2 leading-snug group-hover:underline">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#4d4c5c] line-clamp-2 leading-relaxed">{post.content}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs md:text-sm text-[#6a697c] pt-3 border-t border-[#dcdce5]/80">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-medium text-[#4d4c5c]">{post.author}</span>
                          <span className="text-[#dcdce5]">·</span>
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => toggleLike(post.id, e)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${
                              post.likedByMe ? "text-rose-600 bg-rose-50" : "text-[#6a697c] hover:bg-[#f4f4f8]"
                            }`}
                          >
                            ♥ {post.likes}
                          </button>
                          <span>{post.replies} reponses</span>
                          <span>{post.views} vues</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <EmptyState
                title="Aucune discussion avec ces criteres"
                description="Essaie de modifier ta recherche ou la categorie."
              />
            )}
          </>
        )}
      </PageShell>

      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="h-1 bg-[#121117] rounded-t-2xl" />
            <div className="sticky top-0 bg-white border-b border-[#dcdce5] p-5 md:p-6">
              <h3 className="text-lg font-bold text-[#121117]">Nouvelle discussion</h3>
              <p className="text-sm text-[#4d4c5c] mt-1">Seul le titre est obligatoire</p>
            </div>
            <form onSubmit={handleCreatePost} className="p-5 md:p-6 space-y-5">
              {createError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{createError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Titre *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Resume ta question..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Categorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={inputClass}
                >
                  {postCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Details</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Decris ta question en detail..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#dcdce5] text-[#4d4c5c] font-medium hover:bg-[#f4f4f8]"
                >
                  Annuler
                </button>
                <button type="submit" disabled={creating || !newTitle.trim()} className="btn-primary flex-1">
                  {creating ? "Publication..." : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
