import { apiFetch } from "@/lib/api";
import type { AssistantMode } from "@/lib/assistant-quota";
import { getServerAccessToken } from "@/lib/server-auth";

type LogMessage = {
  role: "user" | "assistant";
  content: string;
};

/** Enregistre les échanges assistant en base (best-effort, ne bloque pas la réponse). */
export async function logAssistantMessages(
  mode: AssistantMode,
  messages: LogMessage[]
): Promise<void> {
  const token = await getServerAccessToken();
  if (!token || messages.length === 0) return;

  try {
    await apiFetch("/assistant/log", {
      method: "POST",
      body: JSON.stringify({ mode, messages }),
      serverToken: token,
    });
  } catch (error) {
    console.error("[assistant] log failed", error);
  }
}
