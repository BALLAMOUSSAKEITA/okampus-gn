"use client";

import { usePathname } from "next/navigation";
import WhatsAppAuthPrompt from "@/components/WhatsAppAuthPrompt";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  // Home mobile: annonce + nav + bandeau WhatsApp ; desktop: annonce + nav seulement
  return (
    <main className={`min-h-screen ${isHome ? "pt-[164px] md:pt-[168px] lg:pt-[104px]" : "pt-16"}`}>
      <WhatsAppAuthPrompt />
      {children}
    </main>
  );
}
