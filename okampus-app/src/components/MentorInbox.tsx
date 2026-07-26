"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export interface MentorInboxMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  advisor_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface MentorInboxProps {
  isAdvisor: boolean;
}

export default function MentorInbox({ isAdvisor }: MentorInboxProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MentorInboxMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInbox = useCallback(async () => {
    if (!isAdvisor || !session?.accessToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/mentor-messages/inbox", {
        token: session.accessToken,
      });
      if (!res.ok) throw new Error("Impossible de charger les messages");
      const data = (await res.json()) as MentorInboxMessage[];
      setMessages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [isAdvisor, session?.accessToken]);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const markRead = async (messageId: string) => {
    if (!session?.accessToken) return;
    const res = await apiFetch(`/mentor-messages/${messageId}/read`, {
      method: "PATCH",
      token: session.accessToken,
    });
    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
      );
    }
  };

  if (!isAdvisor) return null;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="border-t border-[#dcdce5] pt-7 mt-7">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#121117] text-sm uppercase tracking-wide">
          Boite de communication
          {unread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[#14b887] text-white text-xs font-bold normal-case">
              {unread}
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => void loadInbox()}
          className="text-xs text-[#6a697c] hover:text-[#121117]"
        >
          Actualiser
        </button>
      </div>

      {loading && <p className="text-sm text-[#6a697c]">Chargement...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <p className="text-sm text-[#6a697c]">Aucun message pour le moment.</p>
      )}

      <ul className="space-y-3">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`rounded-lg border p-4 ${
              msg.read
                ? "border-[#dcdce5] bg-white"
                : "border-[#14b887]/40 bg-emerald-50/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-semibold text-sm text-[#121117]">{msg.sender_name}</p>
              <time className="text-xs text-[#6a697c] shrink-0">
                {new Date(msg.created_at).toLocaleString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <p className="text-sm text-[#4d4c5c] whitespace-pre-wrap">{msg.content}</p>
            {!msg.read && (
              <button
                type="button"
                onClick={() => void markRead(msg.id)}
                className="mt-3 text-xs font-semibold text-[#14b887] hover:underline"
              >
                Marquer comme lu
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
