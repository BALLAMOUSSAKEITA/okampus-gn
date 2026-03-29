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
});

export const metadata: Metadata = {
  title: "O'Kampus - Plateforme de l'étudiant guinéen | Bac → Études → Emploi",
  description:
    "O'Kampus est une plateforme complète pour l'étudiant guinéen : préparation au bac, orientation, conseils (chat & rendez-vous), forum, CV et insertion professionnelle.",
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
            <main className="pt-16 min-h-screen">{children}</main>
            <PWAInstallPrompt />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
