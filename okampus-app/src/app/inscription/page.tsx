"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { UserRole } from "@/types";
import AuthCardShell from "@/components/auth/AuthCardShell";
import PasswordField, { inputClass } from "@/components/auth/PasswordField";
import { BAC_OPTIONS } from "@/lib/bac-options";
import { signInWithRedirect } from "@/lib/auth-client";
import { resolveCallbackUrl } from "@/lib/auth-redirect";
import { parseContactIdentifier } from "@/lib/contact";
import { apiFetch } from "@/lib/api";
import { validatePassword } from "@/lib/password-policy";

const fieldClass = `${inputClass} !py-3 !text-base !rounded-lg !border-[#dddfe2] focus:!border-[#14b887] focus:!ring-[#14b887]/20`;
const primaryBtn =
  "w-full py-3 rounded-lg bg-[#14b887] hover:bg-[#12a578] text-white text-[17px] font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const secondaryBtn =
  "flex-1 py-3 rounded-lg border border-[#dddfe2] bg-[#f0f2f5] text-[#121117] text-[15px] font-semibold hover:bg-[#e4e6eb] transition-colors";

function InscriptionForm() {
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
        setError("Sélectionne ton option au bac");
        return false;
      }
    }
    if (role === "etudiant") {
      if (!formData.university.trim()) {
        setError("Indique ton université");
        return false;
      }
      if (!formData.field.trim()) {
        setError("Indique ta filière");
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

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!acceptedPrivacy) {
      setError("Accepte la politique de confidentialité pour continuer");
      return;
    }

    setLoading(true);

    try {
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

      const res = await apiFetch("/auth/register", {
        method: "POST",
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
        setLoading(false);
        return;
      }

      const identifier = contact.email || contact.phone || formData.contact.trim();
      const signInRes = await signInWithRedirect(identifier, formData.password, callbackUrl);
      if (!signInRes.ok) {
        setError("Inscription réussie mais connexion échouée. Essaie de te connecter.");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue. Vérifie ta connexion et réessaie.");
      setLoading(false);
    }
  };

  const loginHref =
    callbackUrl !== "/"
      ? `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/connexion";

  return (
    <AuthCardShell
      mode="register"
      wide
      title={step === 1 ? "Créer un compte" : "Sécurise ton compte"}
      subtitle={
        step === 1
          ? "Étape 1 sur 2 — dis-nous qui tu es"
          : "Étape 2 sur 2 — email ou téléphone et mot de passe"
      }
      footerHref={loginHref}
      footerLabel="Se connecter"
    >
      <div className="mb-4 flex items-center gap-2" aria-label={`Étape ${step} sur 2`}>
        <span
          className={`h-1 flex-1 rounded-full transition-colors ${
            step >= 1 ? "bg-[#14b887]" : "bg-[#dddfe2]"
          }`}
        />
        <span
          className={`h-1 flex-1 rounded-full transition-colors ${
            step >= 2 ? "bg-[#14b887]" : "bg-[#dddfe2]"
          }`}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "bachelier" as const, label: "Bachelier" },
                  { id: "etudiant" as const, label: "Étudiant" },
                ] as const
              ).map((option) => {
                const active = role === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={`py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      active
                        ? "border-[#14b887] bg-[#14b887]/5 text-[#121117]"
                        : "border-[#dddfe2] bg-white text-[#4d4c5c] hover:border-[#14b887]/40"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="name" className="sr-only">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Nom complet"
                autoComplete="name"
                className={fieldClass}
              />
            </div>

            {role === "bachelier" ? (
              <>
                <div>
                  <label htmlFor="city" className="sr-only">
                    Ville
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Ville (Conakry, Labe...)"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="bacOption" className="sr-only">
                    Option bac
                  </label>
                  <select
                    id="bacOption"
                    value={formData.bacOption}
                    onChange={(e) => update("bacOption", e.target.value)}
                    className={`${fieldClass} text-[#4d4c5c]`}
                  >
                    <option value="">Option au bac</option>
                    {BAC_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="university" className="sr-only">
                    Université
                  </label>
                  <input
                    id="university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => update("university", e.target.value)}
                    placeholder="Université (UGANC, Gamal...)"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="field" className="sr-only">
                    Filière
                  </label>
                  <input
                    id="field"
                    type="text"
                    value={formData.field}
                    onChange={(e) => update("field", e.target.value)}
                    placeholder="Filière (Informatique, Médecine...)"
                    className={fieldClass}
                  />
                </div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="contact" className="sr-only">
                Email ou téléphone
              </label>
              <input
                id="contact"
                type="text"
                inputMode="email"
                value={formData.contact}
                onChange={(e) => update("contact", e.target.value)}
                placeholder="Email ou numéro de téléphone"
                autoComplete="username"
                required
                className={fieldClass}
              />
            </div>

            <PasswordField
              id="password"
              label="Mot de passe (8 caractères min., lettre + chiffre)"
              value={formData.password}
              onChange={(value) => update("password", value)}
              autoComplete="new-password"
              required
              hideLabel
              inputClassName={fieldClass}
            />

            <label className="flex items-start gap-3 text-sm text-[#4d4c5c] cursor-pointer min-h-11">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 shrink-0 rounded border-[#dddfe2] accent-[#14b887]"
              />
              <span className="leading-relaxed py-0.5">
                J&apos;accepte la{" "}
                <Link
                  href="/confidentialite"
                  target="_blank"
                  className="font-semibold text-[#14b887] underline underline-offset-2"
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 text-center"
          >
            {error}
          </div>
        )}

        {step === 1 ? (
          <button type="submit" className={primaryBtn}>
            Continuer
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className={secondaryBtn}
            >
              Retour
            </button>
            <button type="submit" disabled={loading} className={`${primaryBtn} flex-[1.4]`}>
              {loading ? "Création..." : "S'inscrire"}
            </button>
          </div>
        )}
      </form>

      <div className="hidden sm:block mt-4 pt-4 border-t border-[#dddfe2] text-center text-sm text-[#4d4c5c]">
        Déjà un compte ?{" "}
        <Link href={loginHref} className="font-semibold text-[#14b887] hover:underline">
          Se connecter
        </Link>
      </div>
    </AuthCardShell>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f0f2f5] text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <InscriptionForm />
    </Suspense>
  );
}
