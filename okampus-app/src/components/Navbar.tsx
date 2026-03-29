"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const mainNavLinks = [
    { href: "/", label: "Accueil" },
    { href: "/assistant", label: "Assistant" },
    { href: "/conseil", label: "Conseillers" },
    { href: "/forum", label: "Forum" },
  ];

  const moreLinks = [
    { href: "/parcours", label: "Mon parcours" },
    { href: "/stages", label: "Stages & Jobs" },
    { href: "/ressources", label: "Ressources" },
    { href: "/calendrier", label: "Calendrier" },
    { href: "/bourses", label: "Bourses" },
    { href: "/entrepreneuriat", label: "Entrepreneuriat" },
    { href: "/success-stories", label: "Success Stories" },
  ];

  const isMoreLinkActive = moreLinks.some((link) => pathname === link.href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
              O'Kampus
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#c41e3a]"
                    : "text-slate-600 hover:text-[#c41e3a]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Plus */}
            <div className="relative">
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isMoreLinkActive
                    ? "text-[#c41e3a]"
                    : "text-slate-600 hover:text-[#c41e3a]"
                }`}
              >
                Plus
                <svg className={`w-4 h-4 transition-transform ${showMoreDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMoreDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMoreDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-20">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setShowMoreDropdown(false)}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          pathname === link.href
                            ? "bg-[#c41e3a] text-white"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {mounted && (
              user ? (
                <Link
                  href="/profil"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden xl:inline">Profil</span>
                </Link>
              ) : (
                <Link
                  href="/inscription"
                  className="px-5 py-2 bg-[#c41e3a] text-white rounded-lg text-sm font-semibold hover:bg-[#9e1830] transition-colors"
                >
                  S'inscrire
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#c41e3a] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Découvrir
                </p>
              </div>

              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#c41e3a] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {mounted && (
                user ? (
                  <Link
                    href="/profil"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 text-slate-900 font-medium"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    Mon profil
                  </Link>
                ) : (
                  <Link
                    href="/inscription"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-[#c41e3a] text-white rounded-lg text-sm font-semibold text-center"
                  >
                    S'inscrire
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
