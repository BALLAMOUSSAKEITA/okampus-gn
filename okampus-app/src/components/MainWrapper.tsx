"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={`min-h-screen ${isHome ? "pt-[104px]" : "pt-16"}`}>{children}</main>
  );
}
