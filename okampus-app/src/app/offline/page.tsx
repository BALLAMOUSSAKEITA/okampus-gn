"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#121117]">
          <svg
            className="h-8 w-8 text-[#14b887]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M8.288 8.288C6.84 9.22 5.7 10.66 5.086 12.4c2.052 5.538 8.104 8.363 13.518 6.311.52-.197 1.01-.45 1.462-.75M12 5c2.485 0 4.735.91 6.463 2.412"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-bold text-[#121117]">
          Tu es hors ligne
        </h1>
        <p className="mt-3 text-[#4d4c5c] leading-relaxed">
          Pas de connexion pour le moment. Les pages déjà ouvertes peuvent
          rester disponibles grâce au cache. Réessaie dès que le réseau revient.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary px-6 py-3 text-sm">
            Retour à l&apos;accueil
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-sm rounded border border-[#dcdce5] text-[#4d4c5c] font-medium hover:bg-[#f4f4f8] transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    </main>
  );
}
