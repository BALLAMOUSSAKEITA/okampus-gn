"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminFetch, selectClass, type AdminUser } from "@/lib/admin-api";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      setUsers(await adminFetch<AdminUser[]>("/users"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = async (userId: string, role: string) => {
    if (!isAuthenticated) return;
    try {
      await adminFetch(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  };

  const deleteUser = async (userId: string, name: string) => {
    if (!isAuthenticated || !confirm(`Supprimer ${name} ?`)) return;
    try {
      await adminFetch(`/users/${userId}`, { method: "DELETE" });
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
        description="Gèrer les comptes, les roles et les profils inscrits."
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
                  {["Nom", "Contact", "Role", "Profil", "Inscription", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-[#737373]">{u.email || u.phone || "N/A"}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className={`${selectClass} !w-auto !py-1.5`}
                      >
                        <option value="bachelier">Bachelier</option>
                        <option value="etudiant">Étudiant</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="text-xs text-[#737373] max-w-[180px]">
                      {u.role === "bachelier" && u.city && `${u.city} · ${u.bac_option ?? ""}`}
                      {u.role === "etudiant" && u.university && `${u.university} · ${u.field ?? ""}`}
                      {u.is_advisor && (
                        <span className="admin-pill admin-pill-green ml-1">Mentor</span>
                      )}
                    </td>
                    <td className="text-xs text-[#737373]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "N/A"}
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
