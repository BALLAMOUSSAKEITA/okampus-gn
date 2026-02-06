"use client";

import { useState } from "react";

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
      // En production, on enverrait au backend
      setShowNewPost(false);
      setNewPostTitle("");
      setNewPostContent("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forum O&apos;Kampus
            </h1>
            <p className="text-gray-600">
              Posez vos questions sur les universités, filières et l&apos;orientation
            </p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="inline-flex items-center gap-2 bg-[#008751] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00a86b] transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle question
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#008751] text-white"
                    : "bg-white border border-emerald-200 text-gray-600 hover:border-[#008751] hover:text-[#008751]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Rechercher dans le forum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:ml-auto px-4 py-2 rounded-xl border border-emerald-200 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none w-full sm:w-64"
          />
        </div>

        {/* Liste des posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-[#008751] mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#008751] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Par {post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.replies} réponses</span>
                    <span>•</span>
                    <span>{post.views} vues</span>
                  </div>
                </div>
                <span className="text-[#008751] font-medium text-sm sm:flex-shrink-0">
                  Voir les réponses →
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-gray-600">Aucune question trouvée. Soyez le premier à en poser une !</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="mt-4 text-[#008751] font-semibold hover:underline"
            >
              Poser une question
            </button>
          </div>
        )}
      </div>

      {/* Modal Nouvelle question */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nouvelle question</h3>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Résumez votre question..."
                  required
                  className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-[#008751] outline-none"
                >
                  {categories.filter((c) => c !== "Toutes").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Détails</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Décrivez votre question en détail..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-emerald-200 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-[#008751] text-white font-semibold hover:bg-[#00a86b]"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
