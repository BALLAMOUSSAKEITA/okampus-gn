"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { UserRole } from "@/types";
import Logo from "@/components/Logo";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    if (name === "name") {
      if (value.length > 0 && value.length < 2) return "Le nom doit contenir au moins 2 caracteres";
      if (value.length > 100) return "Le nom ne doit pas depasser 100 caracteres";
    }
    if (name === "email") {
      if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Adresse email invalide";
    }
    if (name === "password") {
      if (value.length > 0 && value.length < 8) return "Le mot de passe doit contenir au moins 8 caracteres";
      if (value.length > 128) return "Le mot de passe ne doit pas depasser 128 caracteres";
    }
    return "";
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

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

        const nameErr = validateField("name", formData.name);
        const emailErr = validateField("email", formData.email);
        const passErr = validateField("password", formData.password);
        if (nameErr || emailErr || passErr) {
          setFieldErrors({ name: nameErr, email: emailErr, password: passErr });
          return;
        }

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

        const signInRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          router.push("/profil");
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
          router.push("/");
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
    <div className="min-h-screen mesh-gradient flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" showText={true} className="justify-center" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-6">
            {mode === "register" ? "Creer un compte" : "Bon retour !"}
          </h1>
          <p className="text-slate-500 mt-2">
            {mode === "register"
              ? "Rejoins la communaute des etudiants guineens"
              : "Accede a ton espace personnel"}
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8 shadow-xl shadow-slate-200/50">
          {/* Role Selection */}
          {mode === "register" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Je suis
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("bachelier")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                    role === "bachelier"
                      ? "border-[#c41e3a] bg-red-50 text-[#c41e3a] shadow-sm shadow-red-100"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl block mb-1">🎓</span>
                  <span className="text-sm">Nouveau bachelier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("etudiant")}
                  className={`p-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                    role === "etudiant"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl block mb-1">📚</span>
                  <span className="text-sm">Etudiant</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2.5">
                {role === "bachelier"
                  ? "Tu viens d'avoir ton bac et tu cherches ton orientation"
                  : "Tu es deja a l'universite et tu peux devenir conseiller"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Aissatou Diallo"
                  minLength={2}
                  maxLength={100}
                  required
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50/50 placeholder:text-slate-400 transition-all ${fieldErrors.name ? "border-red-300" : "border-slate-200"}`}
                />
                {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemple.com"
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50/50 placeholder:text-slate-400 transition-all ${fieldErrors.email ? "border-red-300" : "border-slate-200"}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="8 caracteres minimum"
                minLength={8}
                maxLength={128}
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50/50 placeholder:text-slate-400 transition-all ${fieldErrors.password ? "border-red-300" : "border-slate-200"}`}
              />
              {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Chargement...
                </span>
              ) : mode === "register" ? (
                "S'inscrire"
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">ou</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500">
            {mode === "register" ? (
              <>
                Deja un compte ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#c41e3a] font-semibold hover:text-[#9e1830] transition-colors"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#c41e3a] font-semibold hover:text-[#9e1830] transition-colors"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          <Link href="/" className="hover:text-[#c41e3a] transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour a l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
