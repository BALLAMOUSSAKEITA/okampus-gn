"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfilPage() {
  const router = useRouter();
  const { user, isLoaded, logout, updateUser } = useAuth();
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({
    field: "",
    university: "",
    year: "",
    description: "",
    meetLink: "",
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/inscription");
    return null;
  }

  const handleBecomeAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      isAdvisor: true,
      advisorProfile: {
        ...advisorForm,
        availableSlots: ["Lundi 14h-16h", "Mercredi 10h-12h", "Vendredi 15h-17h"],
      },
    });
    setShowAdvisorForm(false);
    setAdvisorForm({ field: "", university: "", year: "", description: "", meetLink: "" });
  };

  const handleStopAdvisor = () => {
    updateUser({ isAdvisor: false, advisorProfile: undefined });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-2xl text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "bachelier"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {user.role === "bachelier" ? "Nouveau bachelier" : "Étudiant"}
              </span>
            </div>
          </div>

          {user.role === "etudiant" && (
            <div className="border-t border-amber-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Statut conseiller</h3>
              {user.isAdvisor && user.advisorProfile ? (
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-emerald-800 font-medium mb-2">✓ Tu es conseiller</p>
                  <p className="text-sm text-gray-700">
                    <strong>{user.advisorProfile.field}</strong> • {user.advisorProfile.university} • {user.advisorProfile.year}
                  </p>
                  {user.advisorProfile.description && (
                    <p className="text-sm text-gray-600 mt-2 italic">&quot;{user.advisorProfile.description}&quot;</p>
                  )}
                  <button
                    onClick={handleStopAdvisor}
                    className="mt-3 text-sm text-red-600 hover:underline"
                  >
                    Ne plus être conseiller
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    En tant qu&apos;étudiant, tu peux aider les bacheliers en devenant conseiller. 
                    Tu pourras discuter avec eux et prendre des rendez-vous pour des appels Meet.
                  </p>
                  <button
                    onClick={() => setShowAdvisorForm(true)}
                    className="px-4 py-2 bg-[#008751] text-white rounded-xl font-medium hover:bg-[#00a86b] transition-colors"
                  >
                    Devenir conseiller
                  </button>
                </>
              )}
            </div>
          )}

          <div className="border-t border-amber-100 pt-6 mt-6">
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-red-600 hover:underline text-sm"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/assistant"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-violet-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">🤖</span>
            <span className="font-medium">Assistant IA</span>
          </Link>
          <Link
            href="/conseil"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">💬</span>
            <span className="font-medium">Conseillers</span>
          </Link>
          <Link
            href="/forum"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-emerald-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="font-medium">Forum</span>
          </Link>
        </div>
      </div>

      {/* Modal Devenir conseiller */}
      {showAdvisorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Devenir conseiller</h3>
            <form onSubmit={handleBecomeAdvisor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                <input
                  type="text"
                  value={advisorForm.field}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, field: e.target.value })}
                  placeholder="Ex: Médecine, Droit, Informatique"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Université</label>
                <input
                  type="text"
                  value={advisorForm.university}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, university: e.target.value })}
                  placeholder="Ex: UGANC, Gamal"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <input
                  type="text"
                  value={advisorForm.year}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, year: e.target.value })}
                  placeholder="Ex: 4ème année"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Petite description de toi (visible par les bacheliers)
                </label>
                <textarea
                  value={advisorForm.description}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, description: e.target.value })}
                  placeholder="Ex: Passionné par la médecine, j'aime partager mon expérience avec les futurs étudiants..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien Meet pour les rendez-vous (optionnel)
                </label>
                <input
                  type="url"
                  value={advisorForm.meetLink}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvisorForm(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-[#008751] text-white font-semibold hover:bg-[#00a86b]"
                >
                  Devenir conseiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
