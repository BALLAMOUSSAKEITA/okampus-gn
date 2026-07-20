"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminFetch, type AdminMentor } from "@/lib/admin-api";

export default function AdminMentorsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [mentors, setMentors] = useState<AdminMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setMentors(await adminFetch<AdminMentor[]>("/mentors", token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (userId: string, name: string) => {
    if (!token || !confirm(`Retirer le statut mentor de ${name} ?`)) return;
    try {
      await adminFetch(`/mentors/${userId}`, token, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121117]">Mentors</h1>
        <p className="text-[#4d4c5c] mt-1">Etudiants conseillers inscrits sur la plateforme</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="card overflow-hidden bg-white">
        {loading ? (
          <p className="p-6 text-sm text-[#6a697c]">Chargement...</p>
        ) : mentors.length === 0 ? (
          <p className="p-6 text-sm text-[#6a697c]">Aucun mentor pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dcdce5] bg-[#f4f4f8]">
                  {["Nom", "Email", "Filiere", "Universite", "Annee", "Description", ""].map((h) => (
                    <th key={h || "a"} className="text-left px-4 py-3 font-semibold text-[#4d4c5c]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mentors.map((m) => (
                  <tr key={m.user_id} className="border-b border-[#dcdce5]">
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-[#4d4c5c]">{m.email}</td>
                    <td className="px-4 py-3">{m.field}</td>
                    <td className="px-4 py-3">{m.university}</td>
                    <td className="px-4 py-3">{m.year}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-[#4d4c5c]">{m.description}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(m.user_id, m.name)}
                        className="text-red-600 text-xs font-medium hover:underline"
                      >
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
