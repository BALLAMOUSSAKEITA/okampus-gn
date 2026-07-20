import { apiFetch } from "@/lib/api";

export async function adminFetch<T>(
  path: string,
  token: string | undefined,
  options: RequestInit = {}
): Promise<T> {
  const res = await apiFetch(`/admin${path}`, { ...options, token });
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
  email: string;
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
  email: string;
  field: string;
  university: string;
  year: string;
  description: string;
  meet_link?: string;
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
