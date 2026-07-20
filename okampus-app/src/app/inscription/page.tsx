"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { UserRole } from "@/types";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all placeholder:text-[#6a697c]";

export default function InscriptionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRole] = useState<UserRole>("bachelier");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!formData.name || !formData.email || !formData.password) {
          setError("Tous les champs sont requis");
          return;
        }

        // Inscription via FastAPI
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, role }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.detail || "Erreur lors de l'inscription");
          return;
        }

        // Connexion automatique après inscription
        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          router.push("/profil");
        } else {
          setError("Inscription réussie mais connexion échouée");
        }
      } else {
        // Connexion
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.ok) {
          router.push("/");
        } else {
          setError("Email ou mot de passe incorrect");
        }
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell narrow className="flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-[#121117]">
            O&apos;Kampus
          </Link>
        </div>

        <PageHeader
          title={mode === "register" ? "Creer un compte" : "Connexion"}
          description={
            mode === "register"
              ? "Rejoins la communaute O'Kampus"
              : "Accede a ton espace personnel"
          }
          centered
        />

        <div className="card p-6 sm:p-8">
          {mode === "register" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#4d4c5c] mb-2">
                Je suis
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("bachelier")}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    role === "bachelier"
                      ? "border-[#121117] bg-[#f4f4f8] text-[#121117]"
                      : "border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117]/30"
                  }`}
                >
                  🎓 Nouveau bachelier
                </button>
                <button
                  type="button"
                  onClick={() => setRole("etudiant")}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    role === "etudiant"
                      ? "border-[#121117] bg-[#f4f4f8] text-[#121117]"
                      : "border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117]/30"
                  }`}
                >
                  📚 Étudiant
                </button>
              </div>
              <p className="text-xs text-[#6a697c] mt-2">
                {role === "bachelier"
                  ? "Tu viens d'avoir ton bac et tu cherches ton orientation"
                  : "Tu es déjà à l'université et tu peux devenir conseiller"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aissatou Diallo"
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemple.com"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Chargement..."
                : mode === "register"
                ? "S'inscrire"
                : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-[#4d4c5c] mt-4">
            {mode === "register" ? (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#121117] font-medium hover:underline"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#121117] font-medium hover:underline"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-[#6a697c] mt-6">
          <Link href="/" className="hover:text-[#121117]">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
