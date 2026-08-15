"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";
import { hasDismissedWhatsAppPrompt, markWhatsAppPromptDismissed } from "@/lib/whatsapp-prompt";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const SKIP_PATHS = ["/connexion", "/inscription", "/confidentialite", "/offline"];

export default function WhatsAppAuthPrompt() {
  const pathname = usePathname();
  const { user, isLoaded } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) {
      setVisible(false);
      return;
    }
    if (pathname.startsWith("/admin") || SKIP_PATHS.includes(pathname)) {
      setVisible(false);
      return;
    }
    if (!hasCompletedOnboarding(user.id)) {
      setVisible(false);
      return;
    }
    if (hasDismissedWhatsAppPrompt(user.id)) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(timer);
  }, [isLoaded, user, pathname]);

  if (!visible || !user) return null;

  const dismiss = () => {
    markWhatsAppPromptDismissed(user.id);
    setVisible(false);
  };

  const join = () => {
    markWhatsAppPromptDismissed(user.id);
    setVisible(false);
    window.open(WHATSAPP_COMMUNITY_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="border-b border-[#25D366]/20 bg-[#ecfdf3] px-4 sm:px-6 py-3 animate-slideDown"
      role="region"
      aria-label="Invitation communauté WhatsApp"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          <p className="text-sm sm:text-[15px] text-[#121117] leading-snug">
            <span className="font-semibold">Rejoins notre communauté WhatsApp</span>
            {" — "}
            annonces, bourses et opportunités, directement sur ton téléphone.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
          <button
            type="button"
            onClick={join}
            className="inline-flex items-center justify-center rounded bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
          >
            Rejoindre
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center justify-center rounded border border-[#121117]/10 bg-white px-3 py-2 text-sm font-medium text-[#4d4c5c] hover:text-[#121117] transition-colors"
            aria-label="Fermer l'invitation WhatsApp"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
