"use client";

import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const inputClass =
  "w-full px-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all placeholder:text-[#6a697c]";

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

const categories = [
  "Toutes",
  "Universités",
  "Filières",
  "Débouchés",
  "Vie étudiante",
  "Autres",
];

const mockPosts: ForumPost[] = [
  {
    id: "1",
    title: "Quelle est la meilleure université pour la médecine en Guinée ?",
    content: "Je suis bachelier et j'aimerais savoir quelles sont les options pour étudier la médecine. UGANC, Gamal ? Merci pour vos retours !",
    author: "Bachelier2025",
    category: "Universités",
    date: "Il y a 2h",
    replies: 12,
    views: 89,
  },
  {
    id: "2",
    title: "Débouchés après une licence en informatique",
    content: "Est-ce que les diplômés en informatique trouvent facilement du travail en Guinée ou faut-il envisager l'international ?",
    author: "FutureDev",
    category: "Débouchés",
    date: "Il y a 5h",
    replies: 8,
    views: 156,
  },
  {
    id: "3",
    title: "Différence entre Droit et Sciences Politiques ?",
    content: "Je hésite entre ces deux filières. Quelqu'un pourrait m'éclairer sur les différences et les débouchés de chacune ?",
    author: "Curieux",
    category: "Filières",
    date: "Il y a 1 jour",
    replies: 15,
    views: 234,
  },
  {
    id: "4",
    title: "Comment se passe la vie étudiante à l'UGANC ?",
    content: "Logement, restauration, activités... Je voudrais avoir une idée de ce qui m'attend si j'intègre l'UGANC.",
    author: "NouveauBac",
    category: "Vie étudiante",
    date: "Il y a 2 jours",
    replies: 23,
    views: 412,
  },
  {
    id: "5",
    title: "Filière Génie Civil - niveau requis ?",
    content: "Quel profil (série au bac) est recommandé pour le génie civil ? Et quel est le rythme de travail ?",
    author: "BacScientifique",
    category: "Filières",
    date: "Il y a 3 jours",
    replies: 6,
    views: 78,
  },
];

const categoryColors: Record<string, string> = {
  "Universités": "bg-[#ffdf3d]/40 text-[#121117] border-[#dcdce5]",
  "Filières": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Débouchés": "bg-amber-50 text-amber-700 border-[#dcdce5]",
  "Vie étudiante": "bg-violet-50 text-violet-700 border-violet-200",
  "Autres": "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]",
};

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Filières");

  const filteredPosts = mockPosts.filter((post) => {
    const matchCategory = selectedCategory === "Toutes" || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim()) {
      setShowNewPost(false);
      setNewPostTitle("");
      setNewPostContent("");
    }
  };

  return (
    <>
    <PageShell narrow>
      <PageHeader
        eyebrow="Communaute"
        title="Forum"
        description="Pose tes questions sur les universites et les filieres"
        action={
          <button onClick={() => setShowNewPost(true)} className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle question
          </button>
        }
      />

        {/* Filtres - Responsive */}
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

        {/* Liste des posts */}
        <div className="space-y-3 md:space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="card p-5 md:p-6 cursor-pointer group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryColors[post.category] || "bg-[#f4f4f8] text-[#4d4c5c] border-[#dcdce5]"}`}>
                      {post.category}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-[#121117] mb-2 group-hover:text-[#121117] transition-colors leading-snug">
                      {post.title}
                    </h3>
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
                    <span className="flex items-center gap-1.5 hover:text-[#121117] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.replies}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-[#121117] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 card">
            <div className="w-16 h-16 mx-auto rounded-lg bg-[#f4f4f8] flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[#4d4c5c] mb-4 text-sm">Aucune question trouvée</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="text-[#121117] font-semibold text-sm hover:text-[#4d4c5c] transition-colors"
            >
              Poser la première question
            </button>
          </div>
        )}
    </PageShell>
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#dcdce5] p-4 md:p-6 rounded-t-2xl">
              <div className="h-1 w-12 rounded-full bg-[#121117] mb-5 hidden md:block" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-[#121117]">Nouvelle question</h3>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-[#f4f4f8] rounded-xl transition-colors text-[#6a697c] hover:text-[#4d4c5c]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmitPost} className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Titre</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Résume ta question..."
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Catégorie</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 focus:bg-white outline-none transition-all"
                >
                  {categories.filter((c) => c !== "Toutes").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-2">Détails</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Décris ta question en détail..."
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 focus:bg-white outline-none resize-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#dcdce5] text-[#4d4c5c] font-medium hover:bg-[#f4f4f8] transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
