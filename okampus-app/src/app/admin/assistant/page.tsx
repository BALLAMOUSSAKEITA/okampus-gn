"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminFetch,
  type AdminAssistantUsage,
  type AdminAssistantUsageUser,
} from "@/lib/admin-api";

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (limit == null) {
    return <span className="text-xs text-[#737373]">Illimite</span>;
  }

  const ratio = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone =
    ratio >= 100 ? "bg-red-500" : ratio >= 80 ? "bg-amber-500" : "bg-[#16a34a]";

  return (
    <div className="min-w-[120px]">
      <div className="flex items-center justify-between text-xs text-[#737373] mb-1">
        <span>{used}/{limit}</span>
        <span>{ratio}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#e5e5e5] overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}

function LimitBadge({ atLimit, label }: { atLimit: boolean; label: string }) {
  if (!atLimit) return null;
  return <span className="admin-pill admin-pill-orange ml-2">{label}</span>;
}

export default function AdminAssistantUsagePage() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [data, setData] = useState<AdminAssistantUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "at_limit" | "active">("all");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setData(await adminFetch<AdminAssistantUsage>("/assistant-usage", token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredUsers = useMemo(() => {
    if (!data) return [] as AdminAssistantUsageUser[];

    const query = search.trim().toLowerCase();
    return data.users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        (user.email?.toLowerCase().includes(query) ?? false) ||
        (user.phone?.toLowerCase().includes(query) ?? false);

      if (!matchesSearch) return false;

      if (filter === "at_limit") {
        return user.chat_at_limit || user.orientation_at_limit;
      }
      if (filter === "active") {
        return user.chat_used > 0 || user.orientation_used > 0;
      }
      return true;
    });
  }, [data, search, filter]);

  const summary = data?.summary;

  return (
    <div>
      <AdminPageHeader
        pill={{ label: "Assistant IA", variant: "blue" }}
        title="Consommation Kampus"
        description="Suivi de l'utilisation DeepSeek par compte — periode chat du jour et orientation du mois en cours."
        action={
          <button type="button" onClick={load} className="admin-btn-secondary">
            Actualiser
          </button>
        }
      />

      {error && <div className="admin-alert-error">{error}</div>}

      {loading ? (
        <p className="admin-empty">Chargement...</p>
      ) : summary ? (
        <>
          <div className="admin-stat-grid mb-8">
            <div className="admin-stat-card">
              <span className="admin-pill admin-pill-blue mb-3">Chat aujourd&apos;hui</span>
              <p className="admin-stat-value">{summary.chat_total_today}</p>
              <p className="admin-stat-label">
                messages · limite {summary.chat_daily_limit}/compte · {summary.chat_period_key}
              </p>
            </div>
            <div className="admin-stat-card">
              <span className="admin-pill admin-pill-violet mb-3">Orientation ce mois</span>
              <p className="admin-stat-value">{summary.orientation_total_month}</p>
              <p className="admin-stat-label">
                analyses · limite {summary.orientation_monthly_limit}/compte · {summary.orientation_period_key}
              </p>
            </div>
            <div className="admin-stat-card">
              <span className="admin-pill admin-pill-green mb-3">Utilisateurs actifs</span>
              <p className="admin-stat-value">{summary.active_chat_users_today}</p>
              <p className="admin-stat-label">
                chat aujourd&apos;hui · {summary.active_orientation_users_month} orientation ce mois
              </p>
            </div>
            <div className="admin-stat-card">
              <span className="admin-pill admin-pill-orange mb-3">Limites atteintes</span>
              <p className="admin-stat-value">
                {summary.users_at_chat_limit + summary.users_at_orientation_limit}
              </p>
              <p className="admin-stat-label">
                {summary.users_at_chat_limit} chat · {summary.users_at_orientation_limit} orientation
              </p>
            </div>
          </div>

          <div className="admin-card mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="admin-input max-w-md"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="admin-select !w-auto"
              >
                <option value="all">Tous les comptes avec usage</option>
                <option value="active">Usage &gt; 0</option>
                <option value="at_limit">Limite atteinte</option>
              </select>
            </div>
          </div>

          <div className="admin-card !p-0 overflow-hidden">
            {filteredUsers.length === 0 ? (
              <p className="admin-empty">Aucune consommation enregistree pour la periode en cours.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      {[
                        "Utilisateur",
                        "Role",
                        "Chat (jour)",
                        "Orientation (mois)",
                        "Derniere activite",
                      ].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id}>
                        <td>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-[#737373]">
                            {user.email || user.phone || "—"}
                          </div>
                          {(user.chat_at_limit || user.orientation_at_limit) && (
                            <div className="mt-1">
                              <LimitBadge atLimit={user.chat_at_limit} label="Chat max" />
                              <LimitBadge atLimit={user.orientation_at_limit} label="Orientation max" />
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="admin-pill admin-pill-violet">{user.role}</span>
                        </td>
                        <td>
                          <UsageBar used={user.chat_used} limit={user.chat_limit} />
                        </td>
                        <td>
                          <UsageBar used={user.orientation_used} limit={user.orientation_limit} />
                        </td>
                        <td className="text-xs text-[#737373] whitespace-nowrap">
                          {user.last_used_at
                            ? new Date(user.last_used_at).toLocaleString("fr-FR")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
