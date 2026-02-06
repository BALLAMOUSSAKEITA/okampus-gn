"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

export default function InscriptionPage() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRole] = useState<UserRole>("bachelier");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Tous les champs sont requis");
        return;
      }
      register(formData.email, formData.password, formData.name, role);
      router.push("/profil");
    } else {
      const success = login(formData.email, formData.password);
      if (success) {
        router.push("/");
      } else {
        setError("Email ou mot de passe incorrect. Inscrivez-vous si vous n'avez pas de compte.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
            O&apos;Kampus
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {mode === "register" ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "register"
              ? "Rejoins la communauté des étudiants guinéens"
              : "Accède à ton espace personnel"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
          {mode === "register" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Je suis
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("bachelier")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    role === "bachelier"
                      ? "border-[#c41e3a] bg-red-50 text-[#c41e3a]"
                      : "border-amber-200 text-gray-600 hover:border-amber-300"
                  }`}
                >
                  🎓 Nouveau bachelier
                </button>
                <button
                  type="button"
                  onClick={() => setRole("etudiant")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${
                    role === "etudiant"
                      ? "border-[#008751] bg-emerald-50 text-[#008751]"
                      : "border-amber-200 text-gray-600 hover:border-amber-300"
                  }`}
                >
                  📚 Étudiant
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {role === "bachelier"
                  ? "Tu viens d'avoir ton bac et tu cherches ton orientation"
                  : "Tu es déjà à l'université et tu peux devenir conseiller"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aissatou Diallo"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemple.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {mode === "register" ? "S&apos;inscrire" : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {mode === "register" ? (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#c41e3a] font-medium hover:underline"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#c41e3a] font-medium hover:underline"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="hover:text-[#c41e3a]">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
