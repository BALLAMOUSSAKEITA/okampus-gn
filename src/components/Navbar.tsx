"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/assistant", label: "Assistant IA" },
    { href: "/conseil", label: "Conseil" },
    { href: "/forum", label: "Forum" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
              O&apos;Kampus
            </span>
            <span className="text-xs text-amber-600 font-medium hidden sm:inline">Guinée</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#c41e3a]"
                    : "text-gray-600 hover:text-[#c41e3a]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {mounted && (
              user ? (
                <Link
                  href="/profil"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-medium hover:bg-amber-200"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </span>
                  Mon profil
                </Link>
              ) : (
                <Link
                  href="/inscription"
                  className="bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-red-200 transition-all"
                >
                  S&apos;inscrire
                </Link>
              )
            )}
            <Link
              href="/conseil"
              className="bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-red-200 transition-all"
            >
              Parler à un conseiller
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-amber-100 animate-fade-in-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-2 ${
                    pathname === link.href ? "text-[#c41e3a]" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {mounted && (
                user ? (
                  <Link href="/profil" onClick={() => setIsOpen(false)} className="font-medium py-2 text-[#c41e3a]">
                    Mon profil
                  </Link>
                ) : (
                  <Link href="/inscription" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white px-5 py-3 rounded-full font-semibold text-center">
                    S&apos;inscrire
                  </Link>
                )
              )}
              <Link href="/conseil" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white px-5 py-3 rounded-full font-semibold text-center">
                Parler à un conseiller
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
