"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminFetch, type AdminStats } from "@/lib/admin-api";

const statCards = [
  { key: "users", label: "Utilisateurs", href: "/admin/users", pill: "violet" as const },
  { key: "mentors", label: "Mentors", href: "/admin/mentors", pill: "green" as const },
  { key: "stages", label: "Stages", href: "/admin/stages", pill: "orange" as const },
  { key: "stories", label: "Success Stories", href: "/admin/stories", pill: "blue" as const },
  { key: "scholarships", label: "Bourses", href: "/admin/bourses", pill: "violet" as const },
  { key: "resources", label: "Ressources", href: "/admin/ressources", pill: "green" as const },
  { key: "calendar_events", label: "Evenements", href: "/admin/calendrier", pill: "orange" as const },
  { key: "entrepreneur_projects", label: "Projets", href: "/admin/entrepreneuriat", pill: "blue" as const },
  { key: "forum_posts", label: "Posts forum", href: "/admin/forum", pill: "violet" as const },
] as const;

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.accessToken) return;
    adminFetch<AdminStats>("/stats", session.accessToken)
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"));
  }, [session?.accessToken]);

  return (
    <div>
      <AdminPageHeader
        pill={{ label: "Vue d'ensemble", variant: "blue" }}
        title="Tableau de bord"
        description={`Bienvenue ${session?.user?.name ?? "Admin"} — suivi en temps reel de la plateforme.`}
      />

      {error && <div className="admin-alert-error">{error}</div>}

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <Link key={card.key} href={card.href} className="admin-stat-card">
            <span className={`admin-pill admin-pill-${card.pill} mb-3`}>{card.label}</span>
            <p className="admin-stat-value">
              {stats ? stats[card.key as keyof AdminStats] : "—"}
            </p>
            <p className="admin-stat-label">elements enregistres</p>
          </Link>
        ))}
      </div>

      <div className="admin-card mt-8">
        <h2 className="admin-card-title">Actions rapides</h2>
        <div className="admin-quick-actions">
          <Link href="/admin/stages" className="admin-btn-primary">
            + Stage
          </Link>
          <Link href="/admin/stories" className="admin-btn-secondary">
            + Success Story
          </Link>
          <Link href="/admin/bourses" className="admin-btn-secondary">
            + Bourse
          </Link>
          <Link href="/admin/users" className="admin-btn-secondary">
            Gerer les utilisateurs
          </Link>
        </div>
      </div>
    </div>
  );
}
