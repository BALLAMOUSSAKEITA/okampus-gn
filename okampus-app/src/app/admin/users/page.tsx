"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminFetch, selectClass, type AdminUser } from "@/lib/admin-api";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setUsers(await adminFetch<AdminUser[]>("/users", token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = async (userId: string, role: string) => {
    if (!token) return;
    try {
      await adminFetch(`/users/${userId}`, token, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  };

  const deleteUser = async (userId: string, name: string) => {
    if (!token || !confirm(`Supprimer ${name} ?`)) return;
    try {
      await adminFetch(`/users/${userId}`, token, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  };

  return (
    <div>
      <AdminPageHeader
        pill={{ label: "Comptes", variant: "violet" }}
        title="Utilisateurs"
        description="Gerer les comptes, les roles et les profils inscrits."
      />

      {error && <div className="admin-alert-error">{error}</div>}

      <div className="admin-card !p-0 overflow-hidden">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {["Nom", "Email", "Role", "Profil", "Inscription", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-[#737373]">{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className={`${selectClass} !w-auto !py-1.5`}
                      >
                        <option value="bachelier">Bachelier</option>
                        <option value="etudiant">Etudiant</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="text-xs text-[#737373] max-w-[180px]">
                      {u.role === "bachelier" && u.city && `${u.city} — ${u.bac_option ?? ""}`}
                      {u.role === "etudiant" && u.university && `${u.university} — ${u.field ?? ""}`}
                      {u.is_advisor && (
                        <span className="admin-pill admin-pill-green ml-1">Mentor</span>
                      )}
                    </td>
                    <td className="text-xs text-[#737373]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="admin-table-actions">
                      {u.role !== "admin" && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id, u.name)}
                          className="admin-btn-danger"
                        >
                          Supprimer
                        </button>
                      )}
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
