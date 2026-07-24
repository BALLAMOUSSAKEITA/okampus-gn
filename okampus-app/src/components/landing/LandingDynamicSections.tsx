"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { inferGenderFromName } from "@/lib/avatars";

type Mentor = {
  id: string;
  name: string;
  field: string;
  university: string;
  year: string;
  description: string;
};

const MENTOR_COLORS = ["bg-[#99c5ff]", "bg-[#ffdf3d]", "bg-[#f4f4f8]", "bg-[#99c5ff]/60"];

export function LandingFeaturedMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/mentors?limit=4`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMentors(Array.isArray(data) ? data : []))
      .catch(() => setMentors([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (mentors.length === 0) {
    return (
      <section className="bg-[#f4f4f8] py-16 px-4 sm:px-6 border-y border-[#dcdce5]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-display text-[28px] sm:text-[36px] font-bold text-[#121117] leading-tight">
            Mentors
          </h2>
          <p className="mt-3 text-[#4d4c5c] max-w-md mx-auto">
            Aucun mentor disponible pour le moment. Reviens bientot ou inscris-toi pour devenir mentor.
          </p>
          <Link href="/inscription" className="btn-primary mt-6 inline-flex">
            Devenir mentor
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f4f4f8] py-16 px-4 sm:px-6 border-y border-[#dcdce5]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-[28px] sm:text-[36px] font-bold text-[#121117] leading-tight">
              Mentors disponibles
            </h2>
            <p className="mt-2 text-[#4d4c5c]">Des etudiants qui connaissent deja le terrain</p>
          </div>
          <Link href="/conseil" className="btn-secondary shrink-0">
            Voir tous les mentors
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mentors.map((m, i) => (
            <Link key={m.id} href="/conseil" className="card overflow-hidden group">
              <div className={`h-32 ${MENTOR_COLORS[i % MENTOR_COLORS.length]} flex items-center justify-center`}>
                <UserAvatar name={m.name} gender={inferGenderFromName(m.name)} size={96} />
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#121117]">{m.name}</p>
                <p className="text-xs text-[#4d4c5c] mt-1">
                  {m.field} — {m.university}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
