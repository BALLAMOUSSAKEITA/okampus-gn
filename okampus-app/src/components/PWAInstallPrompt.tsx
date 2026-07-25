"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const AUTH_PATHS = ["/connexion", "/inscription"];
const PROMPT_DELAY_MS = 12000;

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  const onAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    const hasSeenPrompt = localStorage.getItem("pwa-install-dismissed");

    if (isIos() && !hasSeenPrompt) {
      const timer = setTimeout(() => {
        setIosHint(true);
        setShowPrompt(true);
      }, PROMPT_DELAY_MS);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, PROMPT_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler);
    const onInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.removeItem("pwa-install-dismissed");
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
    setTimeout(() => {
      localStorage.removeItem("pwa-install-dismissed");
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (isInstalled || !showPrompt || onAuthPage) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[380px] z-50 animate-slideUp pb-[env(safe-area-inset-bottom)]">
      <div className="card rounded-lg p-5 overflow-hidden relative border-[#dcdce5]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#14b887]" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#121117] rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192x192.png" alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-[#121117] text-base mb-1">
              Installer BacheliO
            </h3>
            <p className="text-sm text-[#4d4c5c] mb-4 leading-relaxed">
              {iosHint
                ? "Sur iPhone : appuie sur Partager, puis « Sur l'écran d'accueil »."
                : "Accède rapidement à la plateforme depuis ton écran d'accueil."}
            </p>

            <div className="flex gap-2">
              {!iosHint && (
                <button
                  onClick={handleInstall}
                  className="flex-1 min-h-11 px-4 py-2.5 btn-primary text-sm"
                >
                  Installer
                </button>
              )}
              <button
                onClick={handleDismiss}
                className={`min-h-11 px-4 py-2.5 rounded border border-[#dcdce5] text-[#4d4c5c] font-medium hover:bg-[#f4f4f8] transition-all text-sm ${iosHint ? "flex-1" : ""}`}
              >
                {iosHint ? "Compris" : "Plus tard"}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-11 h-11 -mr-2 -mt-2 text-[#6a697c] hover:text-[#121117] transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
