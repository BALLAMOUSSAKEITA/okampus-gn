import { apiFetch } from "@/lib/api";

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

export function mapQuota(data: Record<string, unknown>): AssistantQuotaInfo {
  return {
    mode: data.mode as AssistantMode,
    limit: typeof data.limit === "number" ? data.limit : null,
    used: typeof data.used === "number" ? data.used : 0,
    remaining: typeof data.remaining === "number" ? data.remaining : null,
    unlimited: Boolean(data.unlimited),
    periodLabel: typeof data.period_label === "string" ? data.period_label : "",
  };
}

export async function fetchAssistantQuota(
  mode: AssistantMode = "chat"
): Promise<AssistantQuotaInfo> {
  const res = await apiFetch(`/assistant/quota?mode=${mode}`);
  if (!res.ok) {
    throw new Error("Impossible de récupérer le quota assistant");
  }
  const data = (await res.json()) as Record<string, unknown>;
  return mapQuota(data);
}

export function buildQuotaExceededMessage(mode: AssistantMode, limit: number): string {
  const period = mode === "chat" ? "aujourd'hui" : "ce mois-ci";
  const unit = mode === "chat" ? "messages" : "analyses d'orientation";

  return `Tu as bien avance avec Kampus ${period} ! Tu as atteint ta limite de **${limit} ${unit}**.

Pour aller plus loin sur ton cas personnel, un [mentor étudiant](/conseil) peut t'accompagner gratuitement sur BacheliO. C'est un retour d'expérience réel de quelqu'un qui a vécu les mêmes choix que toi.

→ [Contacter un mentor](/conseil)`;
}
