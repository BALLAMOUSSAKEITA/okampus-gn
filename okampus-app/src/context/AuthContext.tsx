"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export type UserRole = "bachelier" | "etudiant" | "admin";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  city?: string;
  bacOption?: string;
  university?: string;
  field?: string;
  isAdvisor?: boolean;
  advisorProfile?: AdvisorProfile | null;
  cvProfile?: CvProfile | null;
  createdAt: string;
}

export interface AdvisorProfile {
  field: string;
  university: string;
  year: string;
  description: string;
  meetLink?: string;
  availableSlots: string[];
}

export interface CvProfile {
  phone?: string;
  location?: string;
  headline?: string;
  about?: string;
  skills: string[];
  languages: string[];
  education: Array<{
    degree: string;
    school: string;
    startYear?: string;
    endYear?: string;
    details?: string;
  }>;
  expériences: Array<{
    title: string;
    company: string;
    location?: string;
    start?: string;
    end?: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    description?: string;
    link?: string;
    bullets: string[];
  }>;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAdvisorProfile(raw: unknown): AdvisorProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  return {
    field: String(data.field ?? ""),
    university: String(data.university ?? ""),
    year: String(data.year ?? ""),
    description: String(data.description ?? ""),
    meetLink: (data.meet_link ?? data.meetLink ?? undefined) as string | undefined,
    availableSlots: (data.available_slots ?? data.availableSlots ?? []) as string[],
  };
}

function mapCvProfile(raw: unknown): CvProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  return {
    phone: (data.phone as string | undefined) ?? undefined,
    location: (data.location as string | undefined) ?? undefined,
    headline: (data.headline as string | undefined) ?? undefined,
    about: (data.about as string | undefined) ?? undefined,
    skills: (data.skills as string[]) ?? [],
    languages: (data.languages as string[]) ?? [],
    education: (data.education as CvProfile["education"]) ?? [],
    expériences: (data.expériences as CvProfile["expériences"]) ?? [],
    projects: (data.projects as CvProfile["projects"]) ?? [],
  };
}

function mapUser(data: Record<string, unknown>): User {
  return {
    id: String(data.id),
    email: (data.email as string | undefined) ?? undefined,
    phone: (data.phone as string | undefined) ?? undefined,
    name: String(data.name ?? ""),
    role: data.role as UserRole,
    city: (data.city as string | undefined) ?? undefined,
    bacOption: (data.bac_option as string | undefined) ?? undefined,
    university: (data.university as string | undefined) ?? undefined,
    field: (data.field as string | undefined) ?? undefined,
    isAdvisor: Boolean(data.is_advisor),
    advisorProfile: mapAdvisorProfile(data.advisor_profile),
    cvProfile: mapCvProfile(data.cv_profile),
    createdAt: (data.created_at as string | undefined) ?? "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") {
        setIsLoaded(false);
        return;
      }

      if (!session?.user?.id) {
        setUser(null);
        setIsLoaded(true);
        return;
      }

      try {
        const res = await apiFetch(`/users/${session.user.id}`, {
          token: session.accèssToken,
        });
        if (res.ok) {
          const data = await res.json();
          setUser(mapUser(data));
        } else {
          setUser(null);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "Impossible de charger le profil utilisateur. Vérifie que l'API FastAPI est démarrée (port 8000).",
            error
          );
        }
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUserData();
  }, [session, status]);

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const payload: Record<string, unknown> = {};

    if (updates.isAdvisor !== undefined) {
      payload.is_advisor = updates.isAdvisor;
    }

    if (updates.advisorProfile !== undefined) {
      if (updates.advisorProfile) {
        payload.advisor_profile = {
          field: updates.advisorProfile.field,
          university: updates.advisorProfile.university,
          year: updates.advisorProfile.year,
          description: updates.advisorProfile.description || "",
          meet_link: updates.advisorProfile.meetLink || null,
          available_slots: updates.advisorProfile.availableSlots || [],
        };
      } else {
        payload.advisor_profile = null;
      }
    }

    if (updates.cvProfile !== undefined && updates.cvProfile) {
      payload.cv_profile = updates.cvProfile;
    }

    try {
      const res = await apiFetch(`/users/${user.id}`, {
        method: "PATCH",
        token: session?.accèssToken,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Failed to update user", err);
        return false;
      }

      const data = await res.json();
      setUser(mapUser(data));
      return true;
    } catch (error) {
      console.error("Failed to update user", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
