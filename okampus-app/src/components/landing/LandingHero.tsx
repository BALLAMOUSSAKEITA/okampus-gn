"use client";

import Link from "next/link";
import GetStartedLink from "@/components/GetStartedLink";
import { useAuth } from "@/context/AuthContext";

export default function LandingHero() {
  const { user, isLoaded, isAuthenticated } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "toi";

  if (!isLoaded) {
    return (
      <div className="animate-fadeInUp">
        <div className="h-6 w-40 bg-[#121117]/10 rounded mb-4 animate-pulse" />
        <div className="h-14 w-full max-w-md bg-[#121117]/10 rounded mb-4 animate-pulse" />
        <div className="h-5 w-full max-w-sm bg-[#121117]/10 rounded animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="animate-fadeInUp">
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121117] mb-3 lg:hidden">
          BacheliO
        </p>
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 sm:mb-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Connecté
        </span>
        <h1 className="font-display text-[34px] sm:text-[56px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.02em] text-[#121117] max-w-[560px]">
          Bonjour {firstName}
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-[#121117]/90 leading-[1.5] max-w-md">
          Reprends là où tu t&apos;es arrêté — assistant IA, mentorat, forum et stages t&apos;attendent.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/assistant" className="btn-primary min-h-12 text-center">
            Ouvrir l&apos;assistant
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/profil" className="btn-secondary bg-white/40 border-[#121117] hover:bg-[#121117] min-h-12 text-center">
            Mon profil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#121117] mb-3 lg:hidden">
        BacheliO
      </p>
      <span className="sticker-label rotate-[-2deg] mb-4 sm:mb-6 inline-block">
        Plateforme étudiante
      </span>
      <h1 className="font-display text-[34px] sm:text-[56px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.02em] text-[#121117] max-w-[560px]">
        Réussis plus vite avec la bonne orientation
      </h1>
      <p className="mt-4 sm:mt-6 text-base sm:text-xl text-[#121117]/90 leading-[1.5] max-w-md">
        IA, mentorat, forum et stages — tout ce qu&apos;il faut pour choisir ta filière et
        construire ton avenir.
      </p>
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
        <GetStartedLink className="btn-primary min-h-12 text-center">
          Commencer
          <span aria-hidden="true">→</span>
        </GetStartedLink>
        <Link
          href="/assistant"
          className="btn-secondary bg-white/40 border-[#121117] hover:bg-[#121117] min-h-12 text-center"
        >
          Tester l&apos;assistant
        </Link>
      </div>
    </div>
  );
}
