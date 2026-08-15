import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";
import WhatsAppIcon from "@/components/WhatsAppIcon";

type WhatsAppCommunityBannerProps = {
  variant?: "default" | "compact" | "strip";
  className?: string;
};

export default function WhatsAppCommunityBanner({
  variant = "default",
  className = "",
}: WhatsAppCommunityBannerProps) {
  if (variant === "strip") {
    return (
      <a
        href={WHATSAPP_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-2.5 w-full ${className}`.trim()}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold text-[#121117] leading-tight truncate">
          Rejoins la communauté WhatsApp
        </span>
        <span className="shrink-0 rounded bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white group-hover:bg-[#1ebe5d] transition-colors">
          Rejoindre
        </span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`animate-fadeInUp ${className}`.trim()}>
        <a
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-lg border border-[#25D366]/25 bg-[#ecfdf3] px-3.5 py-3 shadow-[0_4px_16px_rgba(37,211,102,0.12)] transition-all hover:border-[#25D366]/45"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15px] font-bold leading-tight text-[#121117]">
              Communauté WhatsApp
            </span>
            <span className="block text-xs text-[#4d4c5c] leading-snug mt-0.5">
              Ne rate aucune annonce ni opportunité
            </span>
          </span>
          <span className="shrink-0 rounded bg-[#25D366] px-3 py-2 text-xs font-semibold text-white group-hover:bg-[#1ebe5d] transition-colors">
            Rejoindre
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className={`mt-8 sm:mt-10 lg:mt-12 animate-fadeInUp ${className}`.trim()}>
      <a
        href={WHATSAPP_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-lg border border-[#121117]/10 bg-white/70 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-5 shadow-[0_8px_24px_rgba(18,17,23,0.08)] transition-all hover:border-[#25D366]/40 hover:shadow-[0_12px_32px_rgba(37,211,102,0.15)]"
      >
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.35)]">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg sm:text-xl font-bold text-[#121117] leading-tight">
              Rejoins notre communauté WhatsApp
            </p>
            <p className="mt-1 text-sm sm:text-base text-[#4d4c5c] leading-relaxed">
              Annonces, bourses, dates clés et opportunités — ne rate rien de l&apos;actualité BacheliO.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center justify-center gap-2 shrink-0 rounded bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-[#1ebe5d] sm:min-w-[180px]">
          Rejoindre le groupe
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </a>
    </div>
  );
}
