const STORAGE_PREFIX = "bachelio_onboarding_v1";

export function hasCompletedOnboarding(userId: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(`${STORAGE_PREFIX}_${userId}`) === "done";
}

export function markOnboardingComplete(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}_${userId}`, "done");
}

export function resetOnboarding(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_PREFIX}_${userId}`);
}
