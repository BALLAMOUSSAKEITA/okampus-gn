const STORAGE_PREFIX = "bachelio_whatsapp_prompt_v1";

export function hasDismissedWhatsAppPrompt(userId: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(`${STORAGE_PREFIX}_${userId}`) === "done";
}

export function markWhatsAppPromptDismissed(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}_${userId}`, "done");
}
