"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AssistantMessage from "@/components/AssistantMessage";
import type { OrientationProfile } from "@/lib/orientation-fallback";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const emptyProfile: OrientationProfile = {
  projectEtudes: "",
  forces: "",
  faiblesses: "",
  notes: "",
  serieBac: "",
  passions: "",
};

const WELCOME_MESSAGE = `Bonjour ! Je suis **Kampus**, l'assistant IA de BacheliO.

Je t'accompagne pour choisir ta filiere en Guinee (Sciences Mathematiques, Experimentales ou Sociales), clarifier ton projet d'etudes et trouver les bonnes pistes ([universites & ecoles](/universites), mentors, stages).

**Comment puis-je t'aider dans ton orientation ?**`;

const SUGGESTIONS = [
  { short: "Bac SE, quoi choisir ?", full: "Je viens d'avoir le bac en Sciences Experimentales, je ne sais pas quoi choisir" },
  { short: "Medecine apres SM ?", full: "Je suis en Sciences Mathematiques et je veux faire medecine, c'est realiste ?" },
  { short: "Ou etudier le droit ?", full: "Quelle universite en Guinee pour etudier le droit apres Sciences Sociales ?" },
];

const initialMessages: ChatMessage[] = [
  { role: "assistant", content: WELCOME_MESSAGE },
];

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-[calc(100dvh-4rem)] bg-[#f4f4f8] items-center justify-center text-[#6a697c]">
          Chargement de Kampus...
        </div>
      }
    >
      <AssistantChat />
    </Suspense>
  );
}

function AssistantChat() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prefilledQuerySent = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const callAssistant = async (chatMessages: ChatMessage[]): Promise<string> => {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "chat",
        profile: emptyProfile,
        messages: chatMessages,
      }),
    });

    const data = (await res.json()) as { content?: string; error?: string; fallback?: boolean };
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Connecte-toi pour utiliser l'assistant IA");
      }
      throw new Error(data.error || "Erreur lors de l'appel a l'assistant");
    }
    if (!data.content) {
      throw new Error("Reponse vide de l'assistant");
    }
    if (data.fallback && data.error) {
      setError(data.error);
    } else {
      setError("");
    }
    return data.content;
  };

  const sendMessage = async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(nextMessages);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const content = await callAssistant(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    if (!q || prefilledQuerySent.current) return;
    prefilledQuerySent.current = true;
    sendMessage(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- envoi unique au chargement depuis /universites
  }, [searchParams]);

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-[#f4f4f8]">
      <div className="shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 max-w-[800px] w-full mx-auto">
        <p className="text-sm font-semibold text-[#14b887] mb-1">Assistant IA</p>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#121117]">
          Kampus — ton guide orientation
        </h1>
        {error && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
            {error}
          </div>
        )}
      </div>

      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6"
      >
        <div className="max-w-[800px] mx-auto space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-[#121117] flex items-center justify-center mr-2.5 mt-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[88%] md:max-w-[75%] rounded-lg px-4 py-3.5 ${
                  msg.role === "user"
                    ? "bg-[#121117] text-white"
                    : "bg-white border border-[#dcdce5] text-[#4d4c5c]"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="text-base md:text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
                ) : (
                  <AssistantMessage content={msg.content} />
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 pl-9">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.full}
                  type="button"
                  onClick={() => sendMessage(suggestion.full)}
                  className="text-left text-sm min-h-11 px-3 py-2 rounded border border-[#dcdce5] bg-white text-[#4d4c5c] hover:border-[#121117] hover:text-[#121117] transition-colors"
                >
                  <span className="sm:hidden">{suggestion.short}</span>
                  <span className="hidden sm:inline">{suggestion.full}</span>
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start pl-9">
              <div className="bg-white border border-[#dcdce5] rounded-lg px-4 py-3 text-sm text-[#6a697c]">
                Kampus reflechit...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-[#dcdce5] bg-white px-4 sm:px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSendMessage} className="max-w-[800px] mx-auto">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ecris ton message..."
              className="flex-1 min-h-12 px-4 py-3 text-base md:text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] outline-none placeholder:text-[#6a697c]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn-primary min-h-12 px-4 sm:px-6"
              disabled={isLoading}
            >
              Envoyer
            </button>
          </div>
          <div className="mt-2 flex gap-3">
            <Link href="/conseil" className="text-sm font-medium text-[#4d4c5c] hover:text-[#121117]">
              Mentorat
            </Link>
            <Link href="/forum" className="text-sm font-medium text-[#4d4c5c] hover:text-[#121117]">
              Forum
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
