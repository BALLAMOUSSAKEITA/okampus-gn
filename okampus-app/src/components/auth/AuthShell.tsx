import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface AuthShellProps {
  mode: "login" | "register";
  title: string;
  description: string;
  children: ReactNode;
  compact?: boolean;
}

const brandCopy = {
  login: {
    headline: "Bon retour sur BacheliO",
    support: "Reprends ton orientation, ton mentorat et ton parcours la ou tu t'es arrêté.",
  },
  register: {
    headline: "Rejoins BacheliO",
    support: "Orientation IA, mentors étudiants et opportunités pour avancer après le bac.",
  },
} as const;

export default function AuthShell({
  mode,
  title,
  description,
  children,
  compact = false,
}: AuthShellProps) {
  const brand = brandCopy[mode];

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Panneau brand plein cadre */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden hero-canvas px-10 xl:px-14 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#121117]/10 blur-3xl" />
        </div>

        <Link href="/" className="relative z-10 w-fit animate-fadeIn">
          <Logo size="lg" />
        </Link>

        <div className="relative z-10 max-w-md animate-fadeInUp">
          <span className="sticker-label rotate-[-2deg] mb-6 inline-block">
            Plateforme étudiante
          </span>
          <h1 className="font-display text-[42px] xl:text-[48px] font-bold leading-[1.08] tracking-[-0.02em] text-[#121117]">
            {brand.headline}
          </h1>
          <p className="mt-5 text-lg text-[#121117]/90 leading-relaxed max-w-sm">
            {brand.support}
          </p>
        </div>

        <div className="relative z-10 h-56 xl:h-64 animate-scaleIn" style={{ animationDelay: "120ms" }}>
          <div className="absolute bottom-0 left-4 w-40 xl:w-44 h-48 xl:h-52 rotate-[4deg]">
            <div className="relative w-full h-full landing-photo shadow-[0_10px_28px_rgba(18,17,23,0.18)] ring-2 ring-[#ffdf3d]">
              <Image
                src="/images/jeune-homme.png"
                alt="Mentor BacheliO"
                fill
                sizes="176px"
                className="object-cover object-center"
              />
              <span className="sticker-label absolute bottom-3 left-3 rotate-[-3deg] text-xs z-10">
                Mamadou D.
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-6 w-44 xl:w-48 h-52 xl:h-56 -rotate-3">
            <div className="relative w-full h-full landing-photo shadow-[0_8px_24px_rgba(18,17,23,0.15)]">
              <Image
                src="/images/jeune-fille.png"
                alt="Étudiante BacheliO"
                fill
                sizes="192px"
                className="object-cover object-center"
              />
              <span className="sticker-label absolute bottom-3 left-3 rotate-[-3deg] text-xs z-10">
                Fatoumata S.
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Formulaire */}
      <section
        className={`relative flex items-center justify-center px-4 sm:px-8 bg-[#f4f4f8] ${
          compact ? "py-8 sm:py-10" : "py-10 sm:py-14"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#14b887]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-0 w-56 h-56 bg-[#99c5ff]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-[420px] animate-slideUp">
          <div
            className={`lg:hidden flex flex-col items-center text-center ${
              compact ? "mb-5" : "mb-8"
            }`}
          >
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>

          <header className={compact ? "mb-5" : "mb-8"}>
            <h2
              className={`font-display font-bold tracking-[-0.02em] text-[#121117] ${
                compact ? "text-2xl sm:text-[28px]" : "text-3xl sm:text-[34px]"
              }`}
            >
              {title}
            </h2>
            <p className={`text-[#4d4c5c] leading-relaxed ${compact ? "mt-1 text-sm" : "mt-2"}`}>
              {description}
            </p>
          </header>

          {children}

          <p className={`text-center text-sm text-[#6a697c] ${compact ? "mt-5" : "mt-8"}`}>
            <Link href="/" className="hover:text-[#121117] transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
