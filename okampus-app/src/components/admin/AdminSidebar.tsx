"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links: Array<{
  href: string;
  label: string;
  dot: string;
}> = [
  { href: "/admin", label: "Tableau de bord", dot: "bg-[#2563eb]" },
  { href: "/admin/users", label: "Utilisateurs", dot: "bg-[#7c3aed]" },
  { href: "/admin/mentors", label: "Mentors", dot: "bg-[#16a34a]" },
  { href: "/admin/stages", label: "Stages", dot: "bg-[#ea580c]" },
  { href: "/admin/stories", label: "Success Stories", dot: "bg-[#2563eb]" },
  { href: "/admin/bourses", label: "Bourses", dot: "bg-[#7c3aed]" },
  { href: "/admin/ressources", label: "Ressources", dot: "bg-[#16a34a]" },
  { href: "/admin/calendrier", label: "Calendrier", dot: "bg-[#ea580c]" },
  { href: "/admin/entrepreneuriat", label: "Entrepreneuriat", dot: "bg-[#2563eb]" },
  { href: "/admin/forum", label: "Forum", dot: "bg-[#7c3aed]" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <Link href="/admin">BacheliO Admin</Link>
        <p>Gestion de la plateforme</p>
      </div>

      <nav className="admin-nav">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
            >
              <span className={`admin-nav-dot ${link.dot}`} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-item">
          Retour au site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="admin-nav-item admin-btn-danger !justify-start w-full text-left"
        >
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
