"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasCompletedOnboarding, markOnboardingComplete, resetOnboarding } from "@/lib/onboarding";

const steps = [
  {
    emoji: "👋",
    title: "Bienvenue sur BacheliO !",
    description:
      "La plateforme qui t'accompagne apres le bac : orientation, mentors, forum et opportunites en Guinee.",
    cta: null,
  },
  {
    emoji: "🤖",
    title: "Assistant IA",
    description:
      "Pose tes questions sur les filieres, les universites et ton orientation. L'assistant te guide selon ton profil.",
    cta: { href: "/assistant", label: "Essayer l'assistant" },
  },
  {
    emoji: "🎓",
    title: "Mentorat",
    description:
      "Trouve des etudiants deja en filiere qui peuvent te conseiller, repondre a tes questions et partager leur experience.",
    cta: { href: "/conseil", label: "Voir les mentors" },
  },
  {
    emoji: "💬",
    title: "Messages",
    description:
      "Discute avec tes mentors comme sur Messenger. Envoie un message, recois des reponses et suis tes conversations.",
    cta: { href: "/messages", label: "Mes messages" },
  },
  {
    emoji: "📣",
    title: "Forum",
    description:
      "Echange avec la communaute : questions sur les filieres, temoignages et entraide entre bacheliers et etudiants.",
    cta: { href: "/forum", label: "Explorer le forum" },
  },
  {
    emoji: "💼",
    title: "Stages, bourses & plus",
    description:
      "Consulte les offres de stages, les bourses, les ressources de cours, le generateur CV et ton parcours academique.",
    cta: { href: "/stages", label: "Voir les stages" },
  },
  {
    emoji: "✅",
    title: "Tu es pret !",
    description:
      "Explore la plateforme a ton rythme. Tu retrouveras ton profil en haut a droite pour gerer ton compte et devenir mentor.",
    cta: { href: "/profil", label: "Mon profil" },
  },
] as const;

const SKIP_PATHS = ["/connexion", "/inscription", "/confidentialite", "/offline"];

export default function OnboardingTour() {
  const pathname = usePathname();
  const { user, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const dismiss = useCallback(() => {
    if (user) markOnboardingComplete(user.id);
    setOpen(false);
  }, [user]);

  useEffect(() => {
    const handler = () => {
      if (!user) return;
      resetOnboarding(user.id);
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("bachelio-show-onboarding", handler);
    return () => window.removeEventListener("bachelio-show-onboarding", handler);
  }, [user]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (pathname.startsWith("/admin") || SKIP_PATHS.includes(pathname)) return;
    if (hasCompletedOnboarding(user.id)) return;

    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [isLoaded, user, pathname]);

  if (!open || !user) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Fermer le guide"
        onClick={dismiss}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dddfe2] overflow-hidden animate-slideUp">
        <div className="h-1 bg-[#f0f2f5]">
          <div
            className="h-full bg-[#14b887] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3 mb-6">
            <span className="text-4xl" aria-hidden="true">
              {current.emoji}
            </span>
            <button
              type="button"
              onClick={dismiss}
              className="text-sm font-semibold text-[#6a697c] hover:text-[#121117] shrink-0 py-1"
            >
              Ignorer
            </button>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-[#14b887] mb-2">
            Guide · {step + 1} / {steps.length}
          </p>
          <h2 id="onboarding-title" className="font-display text-2xl font-bold text-[#121117] mb-3">
            {current.title}
          </h2>
          <p className="text-[#4d4c5c] leading-relaxed text-base">{current.description}</p>

          {current.cta && (
            <Link
              href={current.cta.href}
              onClick={dismiss}
              className="inline-block mt-4 text-sm font-semibold text-[#14b887] hover:underline"
            >
              {current.cta.label} →
            </Link>
          )}

          <div className="flex gap-2 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 rounded-lg border border-[#dddfe2] text-[#121117] font-semibold hover:bg-[#f0f2f5] transition-colors"
              >
                Retour
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  dismiss();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              className="flex-[1.4] py-3 rounded-lg bg-[#14b887] hover:bg-[#12a578] text-white font-bold transition-colors"
            >
              {isLast ? "C'est parti !" : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
