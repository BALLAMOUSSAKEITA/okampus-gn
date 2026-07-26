"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

interface Conversation {
  advisor_id: string;
  student_id: string;
  other_user_name: string;
  last_message: string;
  unread_count: number;
}

interface MentorInboxProps {
  isAdvisor?: boolean;
}

export default function MentorInbox({ isAdvisor = false }: MentorInboxProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const res = await apiFetch("/mentor-messages/conversations", {
        token: session.accessToken,
      });
      if (res.ok) {
        setConversations((await res.json()) as Conversation[]);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const unread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  const conversationHref = (conv: Conversation) =>
    isAdvisor
      ? `/messages?advisor=${conv.advisor_id}&student=${conv.student_id}`
      : `/messages?advisor=${conv.advisor_id}`;

  return (
    <div className="border-t border-[#dcdce5] pt-7 mt-7">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#121117] text-sm uppercase tracking-wide">
          Messages
          {unread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[#14b887] text-white text-xs font-bold normal-case">
              {unread}
            </span>
          )}
        </h3>
        <Link href="/messages" className="text-xs font-semibold text-[#14b887] hover:underline">
          Tout voir
        </Link>
      </div>

      {loading && <p className="text-sm text-[#6a697c]">Chargement...</p>}

      {!loading && conversations.length === 0 && (
        <p className="text-sm text-[#6a697c]">Aucune conversation pour le moment.</p>
      )}

      <ul className="space-y-2 mb-4">
        {conversations.slice(0, 3).map((conv) => (
          <li key={`${conv.advisor_id}-${conv.student_id}`}>
            <Link
              href={conversationHref(conv)}
              className="block rounded-lg border border-[#dcdce5] p-3 hover:border-[#14b887]/40 hover:bg-[#14b887]/5 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm text-[#121117] truncate">
                  {conv.other_user_name}
                </p>
                {conv.unread_count > 0 && (
                  <span className="shrink-0 text-xs font-bold text-[#14b887]">
                    {conv.unread_count} nouveau{conv.unread_count > 1 ? "x" : ""}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6a697c] truncate mt-1">{conv.last_message}</p>
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/messages" className="btn-secondary w-full text-center text-sm">
        Repondre dans Messenger
      </Link>
    </div>
  );
}
