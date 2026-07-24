"use client";

import { Suspense, startTransition, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField, { inputClass } from "@/components/auth/PasswordField";
import { resolveCallbackUrl } from "@/lib/auth-redirect";
import { parseContactIdentifier } from "@/lib/contact";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"));
  const authError = searchParams.get("error");

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError ? "Session expiree ou connexion refusee. Reessaie." : ""
  );
  const [loading, setLoading] = useState(false);

  const registerHref =
    callbackUrl !== "/assistant"
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

    setLoading(true);

    try {
      const identifier = parsed.email || parsed.phone || contact.trim();
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.ok) {
        startTransition(() => {
          router.push(callbackUrl);
        });
      } else {
        setError("Identifiant ou mot de passe incorrect");
      }
    } catch {
      setError("Une erreur est survenue. Verifie ta connexion et reessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="login"
      title="Connexion"
      description="Connecte-toi avec ton email ou ton telephone."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
            Email ou telephone
          </label>
          <input
            id="contact"
            type="text"
            inputMode="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email@exemple.com ou 620123456"
            autoComplete="username"
            required
            className={inputClass}
          />
        </div>

        <PasswordField
          id="password"
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
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
              Connexion...
            </>
          ) : (
            <>
              Se connecter
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#4d4c5c] mt-6">
        Pas encore de compte ?{" "}
        <Link
          href={registerHref}
          className="text-[#121117] font-semibold underline underline-offset-2 hover:text-[#14b887] transition-colors"
        >
          S&apos;inscrire
        </Link>
      </p>
      <p className="text-center text-xs text-[#6a697c] mt-3">
        <Link href="/confidentialite" className="hover:text-[#121117] underline underline-offset-2">
          Politique de confidentialite
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  );
}
