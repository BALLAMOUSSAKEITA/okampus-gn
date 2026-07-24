"use client";

import { Suspense, startTransition, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { UserRole } from "@/types";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField, { inputClass } from "@/components/auth/PasswordField";
import { BAC_OPTIONS } from "@/lib/bac-options";
import { resolveCallbackUrl } from "@/lib/auth-redirect";

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"));

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

  const update = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Tous les champs sont requis");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caracteres");
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
          setError(
            detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(", ") ||
              "Erreur lors de l'inscription"
          );
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
        startTransition(() => {
          router.push(callbackUrl);
        });
      } else {
        setError("Inscription reussie mais connexion echouee. Essaie de te connecter.");
      }
    } catch {
      setError("Une erreur est survenue. Verifie ta connexion et reessaie.");
    } finally {
      setLoading(false);
    }
  };

  const loginHref = callbackUrl !== "/assistant"
    ? `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/connexion";

  return (
    <AuthShell
      mode="register"
      title="Creer un compte"
      description="Un compte gratuit pour acceder a l'assistant, aux mentors et a toutes les fonctionnalites."
    >
      <div className="mb-6">
        <p className="block text-sm font-medium text-[#4d4c5c] mb-2">Je suis</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                id: "bachelier" as const,
                label: "Nouveau bachelier",
                hint: "Tu viens d'avoir ton bac et tu cherches ton orientation",
              },
              {
                id: "etudiant" as const,
                label: "Etudiant",
                hint: "Tu es deja a l'universite et tu peux devenir mentor",
              },
            ] as const
          ).map((option) => {
            const active = role === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`text-left p-4 rounded border-2 transition-all duration-200 ${
                  active
                    ? "border-[#121117] bg-white text-[#121117] shadow-[0_0_0_3px_rgba(20,184,135,0.18)]"
                    : "border-[#dcdce5] bg-white/70 text-[#4d4c5c] hover:border-[#121117]/35"
                }`}
              >
                <span className="block font-semibold text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#6a697c] mt-2.5 leading-relaxed">
          {role === "bachelier"
            ? "Tu viens d'avoir ton bac et tu cherches ton orientation"
            : "Tu es deja a l'universite et tu peux devenir mentor"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Aissatou Diallo"
            autoComplete="name"
            required
            className={inputClass}
          />
        </div>

        {role === "bachelier" && (
          <>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                Ville
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Conakry, Labe, Kankan..."
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bacOption" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                Option au bac
              </label>
              <select
                id="bacOption"
                value={formData.bacOption}
                onChange={(e) => update("bacOption", e.target.value)}
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

        {role === "etudiant" && (
          <>
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                Universite
              </label>
              <input
                id="university"
                type="text"
                value={formData.university}
                onChange={(e) => update("university", e.target.value)}
                placeholder="UGB, Gamal, Kofi Annan..."
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="field" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                Filiere
              </label>
              <input
                id="field"
                type="text"
                value={formData.field}
                onChange={(e) => update("field", e.target.value)}
                placeholder="Informatique, Medecine, Droit..."
                className={inputClass}
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="email@exemple.com"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>

        <PasswordField
          id="password"
          label="Mot de passe"
          value={formData.password}
          onChange={(value) => update("password", value)}
          autoComplete="new-password"
          required
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={(value) => update("confirmPassword", value)}
          autoComplete="new-password"
          required
        />

        {error && (
          <div
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 animate-slideDown"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creation du compte...
            </>
          ) : (
            <>
              S&apos;inscrire
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#4d4c5c] mt-6">
        Deja un compte ?{" "}
        <Link href={loginHref} className="text-[#121117] font-semibold underline underline-offset-2 hover:text-[#14b887] transition-colors">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <InscriptionForm />
    </Suspense>
  );
}
