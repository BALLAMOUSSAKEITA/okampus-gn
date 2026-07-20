"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminFetch, inputClass, type AdminUser } from "@/lib/admin-api";

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
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121117]">Utilisateurs</h1>
        <p className="text-[#4d4c5c] mt-1">Gerer les comptes et les roles</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="card overflow-hidden bg-white">
        {loading ? (
          <p className="p-6 text-sm text-[#6a697c]">Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dcdce5] bg-[#f4f4f8]">
                  {["Nom", "Email", "Role", "Profil", "Inscription", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-[#4d4c5c]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#dcdce5]">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-[#4d4c5c]">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className={`${inputClass} !py-1.5 !w-auto`}
                      >
                        <option value="bachelier">Bachelier</option>
                        <option value="etudiant">Etudiant</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#4d4c5c]">
                      {u.role === "bachelier" && u.city && `${u.city} — ${u.bac_option ?? ""}`}
                      {u.role === "etudiant" && u.university && `${u.university} — ${u.field ?? ""}`}
                      {u.is_advisor && " · Mentor"}
                    </td>
                    <td className="px-4 py-3 text-[#6a697c] text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "admin" && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id, u.name)}
                          className="text-red-600 text-xs font-medium hover:underline"
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
