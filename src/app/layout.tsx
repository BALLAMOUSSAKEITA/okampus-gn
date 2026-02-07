import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">{children}</main>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
