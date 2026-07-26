"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";
import GetStartedLink from "./GetStartedLink";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

const mainNavLinks = [
  { href: "/assistant", label: "Assistant IA" },
  { href: "/conseil", label: "Mentorat" },
  { href: "/messages", label: "Messages" },
  { href: "/forum", label: "Forum" },
  { href: "/stages", label: "Stages" },
];

const mobilePrimaryLinks = [
  { href: "/assistant", label: "Assistant IA" },
  { href: "/conseil", label: "Mentorat" },
  { href: "/messages", label: "Messages" },
  { href: "/forum", label: "Forum" },
  { href: "/stages", label: "Stages" },
  { href: "/bourses", label: "Bourses" },
];

const moreLinks = [
  { href: "/universites", label: "Universites & Ecoles" },
  { href: "/parcours", label: "Mon parcours" },
  { href: "/ressources", label: "Ressources" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/bourses", label: "Bourses" },
  { href: "/entrepreneuriat", label: "Entrepreneuriat" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/cv", label: "Generateur CV" },
];

const mobileMoreLinks = moreLinks.filter((link) => link.href !== "/bourses");

const linkTouchClass = "flex items-center min-h-11 px-3 py-2.5 text-base font-medium rounded";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsOpen(false);
    setShowMobileMore(false);
  }, [pathname]);

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
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {isHome && <AnnouncementBar />}
      <nav className="bg-white border-b border-[#dcdce5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 min-h-11">
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
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isMoreLinkActive ? "text-[#121117]" : "text-[#4d4c5c] hover:text-[#121117]"
                  }`}
                >
                  Plus
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${showMoreDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  <>
                    {user.role === "admin" && (
                      <Link href="/admin" className="btn-secondary text-sm !py-2 !px-3">
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 text-sm font-semibold text-[#121117]"
                    >
                      <UserAvatar name={user.name} size={32} />
                      <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/connexion" className="btn-secondary text-sm">
                      Se connecter
                    </Link>
                    <GetStartedLink className="btn-primary text-sm !py-2 !px-5">
                      Commencer
                    </GetStartedLink>
                  </>
                ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded hover:bg-black/5"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {isOpen && (
            <div className="lg:hidden border-t border-[#dcdce5]/40 bg-white animate-slideDown pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="py-2 space-y-0.5">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`${linkTouchClass} text-[#121117]`}
                >
                  Accueil
                </Link>

                {mobilePrimaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`${linkTouchClass} ${
                      pathname === link.href ? "text-[#121117] bg-[#f4f4f8]" : "text-[#4d4c5c]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setShowMobileMore((v) => !v)}
                  className={`${linkTouchClass} w-full justify-between text-[#4d4c5c]`}
                  aria-expanded={showMobileMore}
                >
                  Plus
                  <svg
                    className={`w-4 h-4 transition-transform ${showMobileMore ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMobileMore && (
                  <div className="pl-2 space-y-0.5 border-l-2 border-[#dcdce5] ml-3">
                    {mobileMoreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`${linkTouchClass} ${
                          pathname === link.href ? "text-[#121117] bg-[#f4f4f8]" : "text-[#4d4c5c]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {mounted &&
                  (user ? (
                    <div className="pt-3 px-1 flex flex-col gap-2 border-t border-[#dcdce5] mt-2">
                      <Link
                        href="/profil"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 min-h-11 px-3 py-2 rounded bg-[#f4f4f8]"
                      >
                        <UserAvatar name={user.name} size={36} />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#121117] truncate">{user.name}</p>
                          <p className="text-sm text-[#6a697c]">Mon profil</p>
                        </div>
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="btn-secondary text-center text-sm"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          setIsOpen(false);
                          await signOut({ callbackUrl: "/" });
                        }}
                        className="min-h-11 text-sm font-medium text-red-600 hover:text-red-700 px-3 text-left"
                      >
                        Se deconnecter
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3 px-1 flex flex-col gap-2 border-t border-[#dcdce5] mt-2">
                      <Link
                        href="/connexion"
                        onClick={() => setIsOpen(false)}
                        className="btn-secondary text-center text-base min-h-11"
                      >
                        Se connecter
                      </Link>
                      <GetStartedLink
                        onClick={() => setIsOpen(false)}
                        className="btn-primary text-center text-base min-h-11"
                      >
                        Commencer
                      </GetStartedLink>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
