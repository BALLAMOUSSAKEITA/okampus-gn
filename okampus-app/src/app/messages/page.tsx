"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface Conversation {
  advisor_id: string;
  student_id: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface ThreadMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  advisor_id: string;
  student_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { user, isLoaded } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const advisorParam = searchParams.get("advisor");
  const studentParam = searchParams.get("student");

  const activeAdvisorId = advisorParam || null;
  const activeStudentId =
    studentParam || (user && !user.isAdvisor ? user.id : null);

  const activeConversation = conversations.find(
    (c) =>
      c.advisor_id === activeAdvisorId &&
      c.student_id === (user?.isAdvisor ? studentParam : user?.id)
  );

  const threadTitle =
    activeConversation?.other_user_name ||
    (user?.isAdvisor ? "Conversation" : "Mentor");

  const loadConversations = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoadingList(true);
    try {
      const res = await apiFetch("/mentor-messages/conversations", {
        token: session.accessToken,
      });
      if (!res.ok) throw new Error("Impossible de charger les conversations");
      const data = (await res.json()) as Conversation[];
      setConversations(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingList(false);
    }
  }, [session?.accessToken]);

  const loadThread = useCallback(async () => {
    if (!session?.accessToken || !activeAdvisorId) return;

    const studentId = user?.isAdvisor ? studentParam : user?.id;
    if (!studentId) return;

    setLoadingThread(true);
    setError("");
    try {
      const params = new URLSearchParams({
        advisor_id: activeAdvisorId,
        student_id: studentId,
      });
      const res = await apiFetch(`/mentor-messages/thread?${params}`, {
        token: session.accessToken,
      });
      if (!res.ok) throw new Error("Impossible de charger la conversation");
      const data = (await res.json()) as ThreadMessage[];
      setMessages(data);
      void loadConversations();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setMessages([]);
    } finally {
      setLoadingThread(false);
    }
  }, [session?.accessToken, activeAdvisorId, studentParam, user, loadConversations]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/connexion?callbackUrl=/messages");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (session?.accessToken && user) {
      void loadConversations();
    }
  }, [session?.accessToken, user, loadConversations]);

  useEffect(() => {
    if (activeAdvisorId && (user?.isAdvisor ? studentParam : user?.id)) {
      void loadThread();
      setMobileShowChat(true);
    }
  }, [activeAdvisorId, studentParam, user, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = (conv: Conversation) => {
    const params = new URLSearchParams({ advisor: conv.advisor_id });
    if (user?.isAdvisor) {
      params.set("student", conv.student_id);
    }
    router.push(`/messages?${params}`);
    setMobileShowChat(true);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !session?.accessToken || !activeAdvisorId) return;

    const studentId = user?.isAdvisor ? studentParam : user?.id;
    if (!studentId) return;

    setSending(true);
    setError("");
    try {
      const payload: Record<string, string> = {
        advisor_id: activeAdvisorId,
        content,
      };
      if (user?.isAdvisor) {
        payload.student_id = studentId;
      }

      const res = await apiFetch("/mentor-messages", {
        method: "POST",
        token: session.accessToken,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          typeof err?.detail === "string" ? err.detail : "Envoi impossible"
        );
      }
      setDraft("");
      await loadThread();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setSending(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#6a697c]">
        Chargement...
      </div>
    );
  }

  const showThread = Boolean(
    activeAdvisorId && (user.isAdvisor ? studentParam : user.id)
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121117]">
            Messages
          </h1>
          <p className="text-sm text-[#6a697c] mt-1">
            Discute avec tes mentors comme sur Messenger
          </p>
        </div>
        <Link href="/conseil" className="text-sm font-semibold text-[#14b887] hover:underline shrink-0">
          Trouver un mentor
        </Link>
      </div>

      <div className="card overflow-hidden border border-[#dcdce5] flex h-[calc(100dvh-11rem)] sm:h-[min(72vh,640px)] min-h-[420px]">
        {/* Liste conversations */}
        <aside
          className={`w-full sm:w-[320px] shrink-0 border-r border-[#dcdce5] flex flex-col bg-white ${
            mobileShowChat && showThread ? "hidden sm:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-[#dcdce5] font-semibold text-[#121117]">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingList && (
              <p className="p-4 text-sm text-[#6a697c]">Chargement...</p>
            )}
            {!loadingList && conversations.length === 0 && (
              <div className="p-6 text-center text-sm text-[#6a697c]">
                <p>Aucune conversation.</p>
                <Link href="/conseil" className="text-[#14b887] font-semibold hover:underline mt-2 inline-block">
                  Contacter un mentor
                </Link>
              </div>
            )}
            {conversations.map((conv) => {
              const isActive =
                conv.advisor_id === activeAdvisorId &&
                conv.student_id === (user.isAdvisor ? studentParam : user.id);
              return (
                <button
                  key={`${conv.advisor_id}-${conv.student_id}`}
                  type="button"
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-[#f0f2f5] hover:bg-[#f4f4f8] transition-colors ${
                    isActive ? "bg-[#14b887]/10" : ""
                  }`}
                >
                  <UserAvatar name={conv.other_user_name} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[#121117] truncate">
                        {conv.other_user_name}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[#14b887] text-white text-xs font-bold flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6a697c] truncate mt-0.5">
                      {conv.last_message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Fil de discussion */}
        <section
          className={`flex-1 flex flex-col bg-[#f0f2f5] min-w-0 ${
            !mobileShowChat || !showThread ? "hidden sm:flex" : "flex"
          }`}
        >
          {showThread ? (
            <>
              <div className="px-4 py-3 bg-white border-b border-[#dcdce5] flex items-center gap-3">
                <button
                  type="button"
                  className="sm:hidden text-[#14b887] font-semibold text-sm"
                  onClick={() => setMobileShowChat(false)}
                >
                  ← Retour
                </button>
                <UserAvatar name={threadTitle} size={40} />
                <div>
                  <p className="font-semibold text-[#121117]">{threadTitle}</p>
                  <p className="text-xs text-[#6a697c]">Conversation mentor</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingThread && (
                  <p className="text-sm text-[#6a697c] text-center">Chargement...</p>
                )}
                {!loadingThread && messages.length === 0 && (
                  <p className="text-sm text-[#6a697c] text-center">
                    Envoie le premier message pour demarrer la conversation.
                  </p>
                )}
                {messages.map((msg) => {
                  const mine = msg.sender_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          mine
                            ? "bg-[#14b887] text-white rounded-br-md"
                            : "bg-white text-[#121117] rounded-bl-md border border-[#dddfe2]"
                        }`}
                      >
                        {!mine && (
                          <p className="text-xs font-semibold mb-1 opacity-80">
                            {msg.sender_name}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <time
                          className={`block text-[10px] mt-1 ${mine ? "text-white/75" : "text-[#6a697c]"}`}
                        >
                          {new Date(msg.created_at).toLocaleString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}
                        </time>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {error && (
                <p className="px-4 py-2 text-sm text-red-600 bg-red-50 text-center">{error}</p>
              )}

              <form
                onSubmit={(e) => void sendMessage(e)}
                className="p-3 sm:p-4 bg-white border-t border-[#dcdce5] flex gap-2 items-end"
              >
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ecris un message..."
                  rows={1}
                  className="flex-1 resize-none rounded-full border border-[#dddfe2] px-4 py-2.5 text-base sm:text-sm focus:border-[#14b887] outline-none max-h-28"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="shrink-0 w-11 h-11 rounded-full bg-[#14b887] text-white font-bold disabled:opacity-50 hover:bg-[#12a578] transition-colors"
                  aria-label="Envoyer"
                >
                  →
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-[#4d4c5c] font-medium">
                  Selectionne une conversation ou contacte un mentor
                </p>
                <Link href="/conseil" className="btn-primary mt-4 inline-flex">
                  Voir les mentors
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-[#6a697c]">
          Chargement...
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
