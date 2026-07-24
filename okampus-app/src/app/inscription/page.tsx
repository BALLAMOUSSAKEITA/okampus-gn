"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { UserRole } from "@/types";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import { BAC_OPTIONS } from "@/lib/bac-options";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all placeholder:text-[#6a697c]";

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profil";

  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRole] = useState<UserRole>("bachelier");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    bacOption: "",
    university: "",
    field: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectAfterAuth = () => {
    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/profil");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError("Tous les champs sont requis");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          return;
        }

        if (role === "bachelier") {
          if (!formData.city.trim()) {
            setError("Indique ta ville");
            return;
          }
          if (!formData.bacOption) {
            setError("Selectionne ton option au bac");
            return;
          }
        }

        if (role === "etudiant") {
          if (!formData.university.trim()) {
            setError("Indique ton universite");
            return;
          }
          if (!formData.field.trim()) {
            setError("Indique ta filiere");
            return;
          }
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const payload: Record<string, string> = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        };

        if (role === "bachelier") {
          payload.city = formData.city.trim();
          payload.bac_option = formData.bacOption;
        }

        if (role === "etudiant") {
          payload.university = formData.university.trim();
          payload.field = formData.field.trim();
        }

        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          const detail = data.detail;
          if (Array.isArray(detail)) {
            setError(detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(", ") || "Erreur lors de l'inscription");
          } else {
            setError(detail || "Erreur lors de l'inscription");
          }
          return;
        }

        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          redirectAfterAuth();
        } else {
          setError("Inscription reussie mais connexion echouee");
        }
      } else {
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.ok) {
          redirectAfterAuth();
        } else {
          setError("Email ou mot de passe incorrect");
        }
      }
    } catch {
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
            BacheliO
          </Link>
        </div>

        <PageHeader
          title={mode === "register" ? "Creer un compte" : "Connexion"}
          description={
            mode === "register"
              ? "Un compte est requis pour acceder a toutes les fonctionnalites"
              : "Connecte-toi pour continuer"
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
                  Nouveau bachelier
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
                  Etudiant
                </button>
              </div>
              <p className="text-xs text-[#6a697c] mt-2">
                {role === "bachelier"
                  ? "Tu viens d'avoir ton bac et tu cherches ton orientation"
                  : "Tu es deja a l'universite et tu peux devenir mentor"}
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

            {mode === "register" && role === "bachelier" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Conakry, Labe, Kankan..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Option au bac
                  </label>
                  <select
                    value={formData.bacOption}
                    onChange={(e) => setFormData({ ...formData, bacOption: e.target.value })}
                    className={`${inputClass} text-[#4d4c5c]`}
                  >
                    <option value="">Selectionne ton option</option>
                    {BAC_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {mode === "register" && role === "etudiant" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Universite
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="UGB, Gamal, Kofi Annan..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Filiere
                  </label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    placeholder="Informatique, Medecine, Droit..."
                    className={inputClass}
                  />
                </div>
              </>
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
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className={inputClass}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Chargement..." : mode === "register" ? "S'inscrire" : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-[#4d4c5c] mt-4">
            {mode === "register" ? (
              <>
                Deja un compte ?{" "}
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
            ← Retour a l&apos;accueil
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <InscriptionForm />
    </Suspense>
  );
}
