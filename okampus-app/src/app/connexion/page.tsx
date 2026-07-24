"use client";

import { Suspense, startTransition, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField, { inputClass } from "@/components/auth/PasswordField";
import { resolveCallbackUrl } from "@/lib/auth-redirect";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams.get("callbackUrl"));
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
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
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        startTransition(() => {
          router.push(callbackUrl);
        });
      } else {
        setError("Email ou mot de passe incorrect");
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
      description="Connecte-toi pour continuer ton parcours sur BacheliO."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
            autoComplete="email"
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
