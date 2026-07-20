"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

const mainNavLinks = [
  { href: "/assistant", label: "Assistant IA" },
  { href: "/conseil", label: "Mentorat" },
  { href: "/forum", label: "Forum" },
  { href: "/stages", label: "Stages" },
];

const moreLinks = [
  { href: "/parcours", label: "Mon parcours" },
  { href: "/ressources", label: "Ressources" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/bourses", label: "Bourses" },
  { href: "/entrepreneuriat", label: "Entrepreneuriat" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/cv", label: "Generateur CV" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isMoreLinkActive = moreLinks.some((link) => pathname === link.href);
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {isHome && <AnnouncementBar />}
      <nav className="bg-white border-b border-[#dcdce5]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" showText={true} />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#121117] underline underline-offset-4"
                    : "text-[#4d4c5c] hover:text-[#121117]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="flex items-center gap-1 text-sm font-medium text-[#4d4c5c] hover:text-[#121117]"
              >
                Plus
                <svg className={`w-3.5 h-3.5 transition-transform ${showMoreDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMoreDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#dcdce5] rounded-lg py-2 animate-scaleIn origin-top-right">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMoreDropdown(false)}
                      className={`block px-4 py-2.5 text-sm font-medium ${
                        pathname === link.href
                          ? "bg-[#f4f4f8] text-[#121117]"
                          : "text-[#4d4c5c] hover:bg-[#f4f4f8] hover:text-[#121117]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {mounted &&
              (user ? (
                <Link
                  href="/profil"
                  className="flex items-center gap-2 text-sm font-semibold text-[#121117]"
                >
                  <UserAvatar name={user.name} size={32} />
                  <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/inscription" className="btn-secondary text-sm">
                    Se connecter
                  </Link>
                  <Link href="/inscription" className="btn-primary text-sm !py-2 !px-5">
                    Commencer
                  </Link>
                </>
              ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded hover:bg-black/5"
            aria-label="Menu"
          >
            <svg className="w-5 h-5 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-[#dcdce5]/40 bg-white animate-slideDown pb-4">
            <div className="py-3 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className="block px-2 py-2.5 text-sm font-medium text-[#121117]">
                Accueil
              </Link>
              {[...mainNavLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-2.5 text-sm font-medium ${
                    pathname === link.href ? "text-[#121117] bg-[#f4f4f8]" : "text-[#4d4c5c]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {mounted && !user && (
                <div className="pt-3 px-2 flex flex-col gap-2">
                  <Link href="/inscription" onClick={() => setIsOpen(false)} className="btn-secondary text-center text-sm">
                    Se connecter
                  </Link>
                  <Link href="/inscription" onClick={() => setIsOpen(false)} className="btn-primary text-center text-sm">
                    Commencer
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </header>
  );
}
