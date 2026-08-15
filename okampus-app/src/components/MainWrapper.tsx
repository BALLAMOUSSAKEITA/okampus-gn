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

  // Home: barre annonce (h-9 mobile / h-10 md) + nav h-16
  return (
    <main className={`min-h-screen ${isHome ? "pt-[100px] md:pt-[104px]" : "pt-16"}`}>
      <WhatsAppAuthPrompt />
      {children}
    </main>
  );
}
