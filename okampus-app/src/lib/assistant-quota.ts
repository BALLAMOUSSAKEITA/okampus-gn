import { apiFetch } from "@/lib/api";
import { getServerAccessToken } from "@/lib/server-auth";

export type AssistantMode = "chat" | "orientation";

export interface AssistantQuotaInfo {
  mode: AssistantMode;
  limit: number | null;
  used: number;
  remaining: number | null;
  unlimited: boolean;
  periodLabel: string;
}

export interface AssistantConsumeResult extends AssistantQuotaInfo {
  allowed: boolean;
}

function mapQuota(data: Record<string, unknown>): AssistantQuotaInfo {
  return {
    mode: data.mode as AssistantMode,
    limit: typeof data.limit === "number" ? data.limit : null,
    used: typeof data.used === "number" ? data.used : 0,
    remaining: typeof data.remaining === "number" ? data.remaining : null,
    unlimited: Boolean(data.unlimited),
    periodLabel: typeof data.period_label === "string" ? data.period_label : "",
  };
}

async function serverAuthOptions(options: RequestInit = {}): Promise<RequestInit & { serverToken?: string }> {
  if (typeof window !== "undefined") return options;
  const token = await getServerAccessToken();
  return { ...options, serverToken: token ?? undefined };
}

export async function fetchAssistantQuota(
  mode: AssistantMode = "chat"
): Promise<AssistantQuotaInfo> {
  const res = await apiFetch(`/assistant/quota?mode=${mode}`, await serverAuthOptions());
  if (!res.ok) {
    throw new Error("Impossible de récupérer le quota assistant");
  }
  const data = (await res.json()) as Record<string, unknown>;
  return mapQuota(data);
}

export async function consumeAssistantQuota(
  mode: AssistantMode
): Promise<AssistantConsumeResult> {
  const res = await apiFetch(
    "/assistant/consume",
    await serverAuthOptions({
      method: "POST",
      body: JSON.stringify({ mode }),
    })
  );

  if (!res.ok) {
    throw new Error("Impossible de vérifier le quota assistant");
  }

  const data = (await res.json()) as Record<string, unknown>;
  return {
    allowed: Boolean(data.allowed),
    ...mapQuota(data),
  };
}

export function buildQuotaExceededMessage(mode: AssistantMode, limit: number): string {
  const period = mode === "chat" ? "aujourd'hui" : "ce mois-ci";
  const unit = mode === "chat" ? "messages" : "analyses d'orientation";

  return `Tu as bien avance avec Kampus ${period} ! Tu as atteint ta limite de **${limit} ${unit}**.

Pour aller plus loin sur ton cas personnel, un [mentor étudiant](/conseil) peut t'accompagner gratuitement sur BacheliO — c'est un retour d'expérience réel de quelqu'un qui a vécu les mêmes choix que toi.

→ [Contacter un mentor](/conseil)`;
}
