"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { adminFetch, type AdminStats } from "@/lib/admin-api";

const statCards = [
  { key: "users", label: "Utilisateurs", href: "/admin/users", color: "bg-[#99c5ff]" },
  { key: "mentors", label: "Mentors", href: "/admin/mentors", color: "bg-[#ffdf3d]" },
  { key: "stages", label: "Stages", href: "/admin/stages", color: "bg-[#14b887]" },
  { key: "stories", label: "Success Stories", href: "/admin/stories", color: "bg-[#99c5ff]/60" },
  { key: "scholarships", label: "Bourses", href: "/admin/bourses", color: "bg-[#ffdf3d]/80" },
  { key: "resources", label: "Ressources", href: "/admin/ressources", color: "bg-white" },
  { key: "calendar_events", label: "Evenements", href: "/admin/calendrier", color: "bg-white" },
  { key: "entrepreneur_projects", label: "Projets", href: "/admin/entrepreneuriat", color: "bg-[#14b887]/30" },
  { key: "forum_posts", label: "Posts forum", href: "/admin/forum", color: "bg-[#f4f4f8]" },
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
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121117]">
          Tableau de bord
        </h1>
        <p className="text-[#4d4c5c] mt-1">
          Bienvenue {session?.user?.name} — vue d&apos;ensemble de O&apos;Kampus
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`card p-5 ${card.color} border-[#dcdce5] hover:shadow-md transition-shadow`}
          >
            <p className="text-3xl font-display font-bold text-[#121117]">
              {stats ? stats[card.key as keyof AdminStats] : "—"}
            </p>
            <p className="text-sm font-medium text-[#4d4c5c] mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-5 bg-white">
        <h2 className="font-semibold text-[#121117] mb-2">Actions rapides</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/stages" className="btn-primary !text-sm !py-2">
            + Stage
          </Link>
          <Link href="/admin/stories" className="btn-secondary !text-sm !py-2 bg-white">
            + Success Story
          </Link>
          <Link href="/admin/bourses" className="btn-secondary !text-sm !py-2 bg-white">
            + Bourse
          </Link>
          <Link href="/admin/users" className="btn-secondary !text-sm !py-2 bg-white">
            Gerer les utilisateurs
          </Link>
        </div>
      </div>
    </div>
  );
}
