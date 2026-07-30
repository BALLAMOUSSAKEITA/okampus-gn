import { apiFetch } from "@/lib/api";
import {
  mapQuota,
  type AssistantConsumeResult,
  type AssistantMode,
} from "@/lib/assistant-quota";
import { getServerAccessToken } from "@/lib/server-auth";

/** Usage serveur uniquement (route API assistant). */
export async function consumeAssistantQuota(
  mode: AssistantMode
): Promise<AssistantConsumeResult> {
  const token = await getServerAccessToken();
  const res = await apiFetch("/assistant/consume", {
    method: "POST",
    body: JSON.stringify({ mode }),
    serverToken: token ?? undefined,
  });

  if (!res.ok) {
    throw new Error("Impossible de vérifier le quota assistant");
  }

  const data = (await res.json()) as Record<string, unknown>;
  return {
    allowed: Boolean(data.allowed),
    ...mapQuota(data),
  };
}
