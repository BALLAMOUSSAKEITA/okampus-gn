import type { Metadata, Viewport } from "next";
import { Figtree, Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MainWrapper from "@/components/MainWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OnboardingTour from "@/components/OnboardingTour";
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
  title: "BacheliO - La plateforme etudiante",
  description:
    "BacheliO t'accompagne : orientation IA, mentorat, forum, CV, stages, bourses et insertion professionnelle.",
  applicationName: "BacheliO",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BacheliO",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14b887",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${manrope.variable} ${figtree.variable} ${inter.variable} antialiased`}>
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
          <AuthProvider>
            <Navbar />
            <MainWrapper>{children}</MainWrapper>
            <OnboardingTour />
            <PWAInstallPrompt />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
