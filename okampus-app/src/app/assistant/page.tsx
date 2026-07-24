"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import AssistantMessage from "@/components/AssistantMessage";
import type { OrientationProfile } from "@/lib/orientation-fallback";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const inputClass =
  "w-full px-4 py-3 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all placeholder:text-[#6a697c]";

const emptyProfile: OrientationProfile = {
  projectEtudes: "",
  forces: "",
  faiblesses: "",
  notes: "",
  serieBac: "",
  passions: "",
};

const WELCOME_MESSAGE = `Bonjour ! Je suis **Kampus**, l'assistant IA d'O'Kampus.

Je t'accompagne pour choisir ta filiere en Guinee (Sciences Mathematiques, Experimentales ou Sociales), clarifier ton projet d'etudes et trouver les bonnes pistes (universites, mentors, stages).

**Comment puis-je t'aider dans ton orientation ?**`;

const SUGGESTIONS = [
  "Je viens d'avoir le bac en Sciences Experimentales, je ne sais pas quoi choisir",
  "Je suis en Sciences Mathematiques et je veux faire medecine, c'est realiste ?",
  "Quelle filiere pour l'informatique apres Sciences Sociales ?",
];

const initialMessages: ChatMessage[] = [
  { role: "assistant", content: WELCOME_MESSAGE },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (data.fallback && data.error?.includes("Insufficient Balance")) {
      setError("Compte DeepSeek sans credits — recharge sur platform.deepseek.com");
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

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="Assistant IA"
        title="Kampus — ton guide orientation"
        description="Discute librement pour clarifier ton projet et trouver la filiere qui te correspond"
      />

      {error && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="card flex flex-col h-[calc(100vh-260px)] md:h-[620px] overflow-hidden">
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4 bg-[#f4f4f8]">
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
                className={`max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-3.5 ${
                  msg.role === "user"
                    ? "bg-[#121117] text-white"
                    : "bg-white border border-[#dcdce5] text-[#4d4c5c]"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
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
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="text-left text-xs sm:text-sm px-3 py-2 rounded-full border border-[#dcdce5] bg-white text-[#4d4c5c] hover:border-[#121117] hover:text-[#121117] transition-colors"
                >
                  {suggestion}
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
        </div>

        <form onSubmit={handleSendMessage} className="p-4 md:p-5 border-t border-[#dcdce5] bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ecris ton message..."
              className={`flex-1 ${inputClass}`}
              disabled={isLoading}
            />
            <button type="submit" className="btn-primary px-5 md:px-6" disabled={isLoading}>
              Envoyer
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/conseil" className="btn-secondary text-sm">
          Parler a un mentor
        </Link>
        <Link href="/forum" className="btn-secondary text-sm">
          Explorer le forum
        </Link>
      </div>
    </PageShell>
  );
}
