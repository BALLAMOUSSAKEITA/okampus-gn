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
import { parseContactIdentifier } from "@/lib/contact";

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"));

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>("bachelier");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    password: "",
    city: "",
    bacOption: "",
    university: "",
    field: "",
  });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Indique ton nom complet");
      return false;
    }
    if (role === "bachelier") {
      if (!formData.city.trim()) {
        setError("Indique ta ville");
        return false;
      }
      if (!formData.bacOption) {
        setError("Selectionne ton option au bac");
        return false;
      }
    }
    if (role === "etudiant") {
      if (!formData.university.trim()) {
        setError("Indique ton universite");
        return false;
      }
      if (!formData.field.trim()) {
        setError("Indique ta filiere");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    setError("");
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      goNext();
      return;
    }

    const contact = parseContactIdentifier(formData.contact);
    if (contact.error) {
      setError(contact.error);
      return;
    }

    if (!formData.password) {
      setError("Mot de passe requis");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }

    if (!acceptedPrivacy) {
      setError("Accepte la politique de confidentialite pour continuer");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        password: formData.password,
        role,
      };

      if (contact.email) payload.email = contact.email;
      if (contact.phone) payload.phone = contact.phone;

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
            detail
              .map((d: { msg?: string }) => d.msg)
              .filter(Boolean)
              .join(", ") || "Erreur lors de l'inscription"
          );
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Erreur lors de l'inscription");
        }
        return;
      }

      const identifier = contact.email || contact.phone || formData.contact.trim();
      const signInRes = await signIn("credentials", {
        identifier,
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

  const loginHref =
    callbackUrl !== "/assistant"
      ? `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/connexion";

  return (
    <AuthShell
      mode="register"
      title={step === 1 ? "Qui es-tu ?" : "Ton compte"}
      description={
        step === 1
          ? "Quelques infos pour personnaliser ton parcours."
          : "Email ou telephone, puis un mot de passe."
      }
      compact
    >
      <div className="mb-5 flex items-center gap-2" aria-label={`Etape ${step} sur 2`}>
        <span
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            step >= 1 ? "bg-[#14b887]" : "bg-[#dcdce5]"
          }`}
        />
        <span
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            step >= 2 ? "bg-[#14b887]" : "bg-[#dcdce5]"
          }`}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "bachelier" as const, label: "Bachelier" },
                  { id: "etudiant" as const, label: "Etudiant" },
                ] as const
              ).map((option) => {
                const active = role === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={`py-2.5 px-3 rounded border-2 text-sm font-semibold transition-all ${
                      active
                        ? "border-[#121117] bg-white text-[#121117]"
                        : "border-[#dcdce5] bg-white/70 text-[#4d4c5c] hover:border-[#121117]/35"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Aissatou Diallo"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            {role === "bachelier" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Ville
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Conakry, Labe..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="bacOption" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Option bac
                  </label>
                  <select
                    id="bacOption"
                    value={formData.bacOption}
                    onChange={(e) => update("bacOption", e.target.value)}
                    className={`${inputClass} text-[#4d4c5c]`}
                  >
                    <option value="">Choisir</option>
                    {BAC_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Universite
                  </label>
                  <input
                    id="university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => update("university", e.target.value)}
                    placeholder="UGB, Gamal..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="field" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                    Filiere
                  </label>
                  <input
                    id="field"
                    type="text"
                    value={formData.field}
                    onChange={(e) => update("field", e.target.value)}
                    placeholder="Informatique..."
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-[#4d4c5c] mb-1">
                Email ou telephone
              </label>
              <input
                id="contact"
                type="text"
                inputMode="email"
                value={formData.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="email@exemple.com ou 620123456"
                autoComplete="username"
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
            <p className="text-xs text-[#6a697c] -mt-1">Au moins 6 caracteres</p>

            <label className="flex items-start gap-2.5 text-sm text-[#4d4c5c] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-0.5 rounded border-[#dcdce5]"
              />
              <span>
                J&apos;accepte la{" "}
                <Link
                  href="/confidentialite"
                  target="_blank"
                  className="font-semibold text-[#121117] underline underline-offset-2 hover:text-[#14b887]"
                >
                  politique de confidentialite
                </Link>
              </span>
            </label>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 animate-slideDown"
          >
            {error}
          </div>
        )}

        {step === 1 ? (
          <button type="submit" className="btn-primary w-full">
            Continuer
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className="btn-secondary flex-1 !py-3.5"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-[1.4] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creation...
                </>
              ) : (
                <>
                  S&apos;inscrire
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>

      <p className="text-center text-sm text-[#4d4c5c] mt-5">
        Deja un compte ?{" "}
        <Link
          href={loginHref}
          className="text-[#121117] font-semibold underline underline-offset-2 hover:text-[#14b887] transition-colors"
        >
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
