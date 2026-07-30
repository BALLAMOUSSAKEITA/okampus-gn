"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthCardShell from "@/components/auth/AuthCardShell";
import PasswordField, { inputClass } from "@/components/auth/PasswordField";
import { signInWithRedirect } from "@/lib/auth-client";
import { resolveCallbackUrl } from "@/lib/auth-redirect";
import { parseContactIdentifier } from "@/lib/contact";

const loginInputClass = `${inputClass} !py-3 !text-[17px] !rounded-lg !border-[#dddfe2] focus:!border-[#14b887] focus:!ring-[#14b887]/20`;

function ConnexionForm() {
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"), "/");

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (!authError) return;
    setError(
      authError === "CredentialsSignin"
        ? "Identifiant ou mot de passe incorrect"
        : "Session expirée ou connexion refusée. Réessaie."
    );
  }, [searchParams]);

  const registerHref =
    callbackUrl !== "/"
      ? `/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/inscription";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = parseContactIdentifier(contact);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    if (!password) {
      setError("Mot de passe requis");
      return;
    }

    setLoading(true);

    try {
      const identifier = parsed.email || parsed.phone || contact.trim();
      const result = await signInWithRedirect(identifier, password, callbackUrl);
      if (!result.ok) {
        setError(result.error || "Identifiant ou mot de passe incorrect");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue. Vérifie ta connexion et réessaie.");
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      mode="login"
      title="Se connecter à BacheliO"
      footerHref={registerHref}
      footerLabel="Créer un compte"
    >
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 text-center"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="contact" className="sr-only">
            Email ou téléphone
          </label>
          <input
            id="contact"
            type="text"
            inputMode="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email ou numéro de téléphone"
            autoComplete="username"
            required
            className={loginInputClass}
          />
        </div>

        <PasswordField
          id="password"
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
          hideLabel
          inputClassName={loginInputClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#14b887] hover:bg-[#12a578] text-white text-[17px] font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="text-center pt-1">
          <Link
            href={registerHref}
            className="text-sm text-[#14b887] font-medium hover:underline underline-offset-2"
          >
            Mot de passe oublié ? Contacte le support
          </Link>
        </div>
      </form>

      <div className="hidden sm:block mt-4 pt-4 border-t border-[#dddfe2] text-center text-sm text-[#4d4c5c]">
        Pas encore de compte ?{" "}
        <Link href={registerHref} className="font-semibold text-[#14b887] hover:underline">
          S&apos;inscrire
        </Link>
      </div>
    </AuthCardShell>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f0f2f5] text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  );
}
