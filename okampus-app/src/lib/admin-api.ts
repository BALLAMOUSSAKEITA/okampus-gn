import { apiFetch } from "@/lib/api";

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await apiFetch(`/admin${path}`, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = data.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(", ")
          : `Erreur ${res.status}`
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type AdminStats = {
  users: number;
  mentors: number;
  stages: number;
  stories: number;
  scholarships: number;
  resources: number;
  calendar_events: number;
  entrepreneur_projects: number;
  forum_posts: number;
};

export type AdminUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: string;
  city?: string;
  bac_option?: string;
  university?: string;
  field?: string;
  is_advisor: boolean;
  created_at?: string;
};

export type AdminMentor = {
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  field: string;
  university: string;
  year: string;
  description: string;
  meet_link?: string;
};

export type AdminAssistantUsageSummary = {
  chat_daily_limit: number;
  orientation_monthly_limit: number;
  chat_total_today: number;
  orientation_total_month: number;
  active_chat_users_today: number;
  active_orientation_users_month: number;
  users_at_chat_limit: number;
  users_at_orientation_limit: number;
  chat_period_key: string;
  orientation_period_key: string;
};

export type AdminAssistantUsageUser = {
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  chat_used: number;
  chat_limit: number | null;
  chat_remaining: number | null;
  orientation_used: number;
  orientation_limit: number | null;
  orientation_remaining: number | null;
  chat_at_limit: boolean;
  orientation_at_limit: boolean;
  last_used_at?: string | null;
};

export type AdminAssistantUsage = {
  summary: AdminAssistantUsageSummary;
  users: AdminAssistantUsageUser[];
};

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "checkbox" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  rows?: number;
};

export const inputClass = "admin-input";
export const selectClass = "admin-select";
export const textareaClass = "admin-textarea";
export const labelClass = "admin-label";
