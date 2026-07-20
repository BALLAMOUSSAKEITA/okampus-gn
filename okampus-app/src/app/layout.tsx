import type { Metadata } from "next";
import { Figtree, Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MainWrapper from "@/components/MainWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "O'Kampus - La plateforme etudiante",
  description:
    "O'Kampus t'accompagne : orientation IA, mentorat, forum, CV, stages, bourses et insertion professionnelle.",
  manifest: "/manifest.json",
  themeColor: "#14b887",
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
      <body className={`${manrope.variable} ${figtree.variable} ${inter.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <MainWrapper>{children}</MainWrapper>
            <PWAInstallPrompt />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
