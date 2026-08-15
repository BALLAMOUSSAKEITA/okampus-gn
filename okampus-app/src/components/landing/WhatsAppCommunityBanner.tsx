import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function WhatsAppCommunityBanner() {
  return (
    <div className="mt-8 sm:mt-10 lg:mt-12 animate-fadeInUp">
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
