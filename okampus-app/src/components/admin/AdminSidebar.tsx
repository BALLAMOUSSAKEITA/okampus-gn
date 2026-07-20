"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/users", label: "Utilisateurs", icon: "👥" },
  { href: "/admin/mentors", label: "Mentors", icon: "🎓" },
  { href: "/admin/stages", label: "Stages", icon: "💼" },
  { href: "/admin/stories", label: "Success Stories", icon: "⭐" },
  { href: "/admin/bourses", label: "Bourses", icon: "🎁" },
  { href: "/admin/ressources", label: "Ressources", icon: "📚" },
  { href: "/admin/calendrier", label: "Calendrier", icon: "📅" },
  { href: "/admin/entrepreneuriat", label: "Entrepreneuriat", icon: "🚀" },
  { href: "/admin/forum", label: "Forum", icon: "💬" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#121117] text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="font-display text-lg font-bold">
          O&apos;Kampus Admin
        </Link>
        <p className="text-xs text-[#6a697c] mt-1">Gestion de la plateforme</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#14b887] text-[#121117]"
                  : "text-[#dcdce5] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="block px-3 py-2 text-sm text-[#dcdce5] hover:text-white rounded-lg hover:bg-white/10"
        >
          ← Retour au site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200 rounded-lg hover:bg-white/10"
        >
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
