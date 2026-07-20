"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        pill={{ label: "Mentorat", variant: "green" }}
        title="Mentors"
        description="Etudiants conseillers inscrits et actifs sur la plateforme."
      />

      {error && <div className="admin-alert-error">{error}</div>}

      <div className="admin-card !p-0 overflow-hidden">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : mentors.length === 0 ? (
          <p className="admin-empty">Aucun mentor pour le moment.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {["Nom", "Email", "Filiere", "Universite", "Annee", "Description", ""].map((h) => (
                    <th key={h || "actions"}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mentors.map((m) => (
                  <tr key={m.user_id}>
                    <td className="font-medium">{m.name}</td>
                    <td className="text-[#737373]">{m.email}</td>
                    <td>{m.field}</td>
                    <td>{m.university}</td>
                    <td>
                      <span className="admin-badge-role">{m.year}</span>
                    </td>
                    <td className="max-w-[200px] truncate text-[#737373]">{m.description}</td>
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        onClick={() => remove(m.user_id, m.name)}
                        className="admin-btn-danger"
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
