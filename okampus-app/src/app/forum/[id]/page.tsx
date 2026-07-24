"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { API_URL, apiFetch } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";

const inputClass =
  "w-full px-4 py-3 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all";

interface PostDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  likedByMe: boolean;
  createdAt: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  Orientation: "bg-[#ffdf3d]/40 text-[#121117] border-[#dcdce5]",
  Etudes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Stages: "bg-amber-50 text-amber-700 border-[#dcdce5]",
  "Vie etudiante": "bg-violet-50 text-violet-700 border-violet-200",
  Autre: "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ForumPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const loadPost = useCallback(async () => {
    const res = session?.accessToken
      ? await apiFetch(`/forum/${postId}`, { token: session.accessToken })
      : await fetch(`${API_URL}/forum/${postId}`);
    if (!res.ok) throw new Error("Discussion introuvable");
    const data = await res.json();
    setPost({
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      category: data.category,
      replies: data.replies,
      views: data.views,
      likes: data.likes ?? 0,
      likedByMe: data.liked_by_me ?? false,
      createdAt: data.created_at,
    });
  }, [postId, session?.accessToken]);

  const loadComments = useCallback(async () => {
    const res = await fetch(`${API_URL}/forum/${postId}/comments`);
    if (!res.ok) throw new Error("Impossible de charger les commentaires");
    const data = (await res.json()) as Array<{
      id: string;
      author_name: string;
      content: string;
      created_at: string;
    }>;
    setComments(
      data.map((c) => ({
        id: c.id,
        authorName: c.author_name,
        content: c.content,
        createdAt: c.created_at,
      }))
    );
  }, [postId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([loadPost(), loadComments()]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [loadPost, loadComments]);

  const toggleLike = async () => {
    if (!session?.accessToken) {
      router.push(`/inscription?callbackUrl=/forum/${postId}`);
      return;
    }
    try {
      const res = await apiFetch(`/forum/${postId}/like`, {
        method: "POST",
        token: session.accessToken,
      });
      if (!res.ok) return;
      const data = (await res.json()) as { liked: boolean; likes: number };
      setPost((prev) => (prev ? { ...prev, likes: data.likes, likedByMe: data.liked } : prev));
    } catch {
      /* ignore */
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      router.push(`/inscription?callbackUrl=/forum/${postId}`);
      return;
    }
    const text = commentText.trim();
    if (!text) return;

    setSubmitting(true);
    setCommentError("");
    try {
      const res = await apiFetch(`/forum/${postId}/comments`, {
        method: "POST",
        token: session.accessToken,
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? "Impossible de commenter");
      }
      const created = await res.json();
      setComments((prev) => [
        ...prev,
        {
          id: created.id,
          authorName: created.author_name,
          content: created.content,
          createdAt: created.created_at,
        },
      ]);
      setPost((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : prev));
      setCommentText("");
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell narrow>
        <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
      </PageShell>
    );
  }

  if (error || !post) {
    return (
      <PageShell narrow>
        <EmptyState title="Discussion introuvable" description={error || "Cette discussion n'existe plus."} />
        <Link href="/forum" className="inline-block mt-6 text-sm text-[#6a697c] hover:text-[#121117]">
          ← Retour au forum
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell narrow>
      <Link href="/forum" className="inline-block mb-6 text-sm text-[#6a697c] hover:text-[#121117]">
        ← Retour au forum
      </Link>

      <article className="card p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category] || "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]"}`}>
            {post.category}
          </span>
          <span className="text-xs text-[#6a697c]">{formatDate(post.createdAt)}</span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#121117] mb-4">{post.title}</h1>
        <p className="text-sm text-[#4d4c5c] mb-2">Par {post.author}</p>
        <p className="text-[#121117] leading-relaxed whitespace-pre-wrap mb-6">{post.content}</p>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#dcdce5]">
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              post.likedByMe ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-[#f4f4f8] text-[#4d4c5c] border border-[#dcdce5] hover:border-[#121117]/30"
            }`}
          >
            ♥ {post.likes} J&apos;aime
          </button>
          <span className="text-sm text-[#6a697c]">{post.replies} reponse{post.replies > 1 ? "s" : ""}</span>
          <span className="text-sm text-[#6a697c]">{post.views} vue{post.views > 1 ? "s" : ""}</span>
        </div>
      </article>

      <section className="card p-6 md:p-8">
        <h2 className="font-bold text-lg text-[#121117] mb-6">
          Commentaires ({comments.length})
        </h2>

        {session?.user ? (
          <form onSubmit={submitComment} className="mb-8">
            {commentError && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{commentError}</div>
            )}
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ecris ta reponse..."
              className={`${inputClass} resize-none mb-3`}
            />
            <button type="submit" disabled={submitting || !commentText.trim()} className="btn-primary">
              {submitting ? "Envoi..." : "Commenter"}
            </button>
          </form>
        ) : (
          <p className="mb-8 text-sm text-[#4d4c5c]">
            <Link href={`/inscription?callbackUrl=/forum/${postId}`} className="text-[#121117] font-semibold underline">
              Connecte-toi
            </Link>{" "}
            pour commenter cette discussion.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-[#6a697c]">Aucun commentaire pour le moment. Sois le premier a repondre.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-lg bg-[#f4f4f8] border border-[#dcdce5]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-sm text-[#121117]">{comment.authorName}</span>
                  <span className="text-xs text-[#6a697c]">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-[#4d4c5c] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
