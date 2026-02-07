"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Afficher le prompt après 3 secondes (pour ne pas être trop intrusif)
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem("pwa-install-dismissed");
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Détecter si l'app a été installée
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.removeItem("pwa-install-dismissed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
    
    // Réafficher le prompt après 7 jours
    setTimeout(() => {
      localStorage.removeItem("pwa-install-dismissed");
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fadeInUp">
      <div className="bg-gradient-to-r from-[#c41e3a] to-[#9e1830] rounded-2xl shadow-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
              O
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Installer O'Kampus</h3>
            <p className="text-sm text-white/90 mb-4">
              Accède plus rapidement à la plateforme en l'installant sur ton appareil
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2.5 bg-white text-[#c41e3a] rounded-lg font-semibold hover:bg-white/90 transition-colors text-sm"
              >
                Installer
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 border-2 border-white/30 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
              >
                Plus tard
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tips iOS */}
        <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/80">
          <p className="font-medium mb-1">📱 Sur iOS/Safari :</p>
          <p>Appuie sur le bouton "Partager" puis "Sur l'écran d'accueil"</p>
        </div>
      </div>
    </div>
  );
}
