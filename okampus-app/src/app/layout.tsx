import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "O'Kampus - La plateforme de l'etudiant guineen",
  description:
    "O'Kampus accompagne chaque etudiant guineen : orientation IA, mentorat, forum, CV, stages, bourses et insertion professionnelle.",
  manifest: "/manifest.json",
  themeColor: "#c41e3a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "O'Kampus",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-[72px] min-h-screen">{children}</main>
            <PWAInstallPrompt />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
