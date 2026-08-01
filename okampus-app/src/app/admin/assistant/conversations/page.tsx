"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import AssistantMessage from "@/components/AssistantMessage";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminFetch,
  type AdminAssistantConversation,
  type AdminAssistantConversationDetail,
} from "@/lib/admin-api";

function ModeBadge({ mode }: { mode: string }) {
  const isChat = mode === "chat";
  return (
    <span className={`admin-pill ${isChat ? "admin-pill-blue" : "admin-pill-violet"} text-[10px]`}>
      {isChat ? "Chat" : "Orientation"}
    </span>
  );
}

export default function AdminAssistantConversationsPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [conversations, setConversations] = useState<AdminAssistantConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminAssistantConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "chat" | "orientation">("all");

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const query = params.toString();
      const data = await adminFetch<AdminAssistantConversation[]>(
        `/assistant-conversations${query ? `?${query}` : ""}`
      );
      setConversations(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search]);

  const loadDetail = useCallback(
    async (userId: string, mode: typeof modeFilter) => {
      if (!isAuthenticated) return;
      setDetailLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (mode !== "all") params.set("mode", mode);
        const query = params.toString();
        const data = await adminFetch<AdminAssistantConversationDetail>(
          `/assistant-conversations/${userId}${query ? `?${query}` : ""}`
        );
        setDetail(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
        setDetail(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    const timer = setTimeout(loadConversations, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadConversations, search]);

  useEffect(() => {
    if (selectedUserId) {
      loadDetail(selectedUserId, modeFilter);
    } else {
      setDetail(null);
    }
  }, [selectedUserId, modeFilter, loadDetail]);

  const selectedSummary = useMemo(
    () => conversations.find((c) => c.user_id === selectedUserId) ?? null,
    [conversations, selectedUserId]
  );

  return (
    <div>
      <AdminPageHeader
        pill={{ label: "Assistant IA", variant: "blue" }}
        title="Conversations Kampus"
        description="Historique des échanges entre les utilisateurs et l'assistant IA."
        action={
          <button type="button" onClick={loadConversations} className="admin-btn-secondary">
            Actualiser
          </button>
        }
      />

      {error && <div className="admin-alert-error">{error}</div>}

      <div className="grid lg:grid-cols-[minmax(280px,360px)_1fr] gap-4 items-start">
        <div className="admin-card !p-0 overflow-hidden">
          <div className="p-4 border-b border-[#e5e5e5]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="admin-input w-full"
            />
          </div>

          {loading ? (
            <p className="admin-empty">Chargement...</p>
          ) : conversations.length === 0 ? (
            <p className="admin-empty">
              Aucune conversation enregistrée pour le moment. Les nouveaux échanges apparaîtront ici.
            </p>
          ) : (
            <ul className="max-h-[520px] overflow-y-auto divide-y divide-[#e5e5e5]">
              {conversations.map((conv) => {
                const active = conv.user_id === selectedUserId;
                return (
                  <li key={conv.user_id}>
                    <button
                      type="button"
                      onClick={() => setSelectedUserId(conv.user_id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        active ? "bg-[#eff6ff]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-[#121117] truncate">{conv.name}</p>
                          <p className="text-xs text-[#737373] truncate">
                            {conv.email || conv.phone || "N/A"}
                          </p>
                        </div>
                        <span className="admin-pill admin-pill-violet shrink-0 text-[10px]">
                          {conv.message_count}
                        </span>
                      </div>
                      {conv.last_preview && (
                        <p className="mt-1.5 text-xs text-[#737373] line-clamp-2">{conv.last_preview}</p>
                      )}
                      <p className="mt-1 text-[10px] text-[#a3a3a3]">
                        {conv.last_message_at
                          ? new Date(conv.last_message_at).toLocaleString("fr-FR")
                          : "N/A"}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="admin-card min-h-[420px]">
          {!selectedUserId ? (
            <p className="admin-empty">Sélectionne un utilisateur pour voir sa conversation.</p>
          ) : detailLoading ? (
            <p className="admin-empty">Chargement de la conversation...</p>
          ) : detail ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-[#e5e5e5]">
                <div>
                  <h2 className="font-semibold text-[#121117]">{detail.name}</h2>
                  <p className="text-sm text-[#737373]">
                    {detail.email || detail.phone || "N/A"} · {detail.role}
                  </p>
                  {selectedSummary && (
                    <p className="text-xs text-[#737373] mt-1">
                      {selectedSummary.chat_count} chat · {selectedSummary.orientation_count} orientation
                    </p>
                  )}
                </div>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value as typeof modeFilter)}
                  className="admin-select !w-auto"
                >
                  <option value="all">Tous les messages</option>
                  <option value="chat">Chat uniquement</option>
                  <option value="orientation">Orientation uniquement</option>
                </select>
              </div>

              {detail.messages.length === 0 ? (
                <p className="admin-empty">Aucun message pour ce filtre.</p>
              ) : (
                <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                  {detail.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-lg px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-[#121117] text-white"
                            : "bg-[#f4f4f8] border border-[#e5e5e5] text-[#4d4c5c]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <ModeBadge mode={msg.mode} />
                          <span className="text-[10px] opacity-70">
                            {new Date(msg.created_at).toLocaleString("fr-FR")}
                          </span>
                        </div>
                        {msg.role === "user" ? (
                          <div className="text-sm whitespace-pre-line">{msg.content}</div>
                        ) : (
                          <AssistantMessage content={msg.content} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="admin-empty">Conversation introuvable.</p>
          )}
        </div>
      </div>
    </div>
  );
}
