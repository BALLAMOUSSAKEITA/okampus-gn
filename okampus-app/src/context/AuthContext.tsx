"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Types locaux (frontend)
export type UserRole = "bachelier" | "etudiant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  experiences: Array<{
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
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          token: session.accessToken,
        });
        if (res.ok) {
          const data = await res.json();
          // FastAPI retourne l'objet directement (pas enveloppé dans { user })
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            isAdvisor: data.is_advisor,
            advisorProfile: data.advisor_profile,
            cvProfile: data.cv_profile,
            createdAt: data.created_at ?? "",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUserData();
  }, [session, status]);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const res = await apiFetch(`/users/${user.id}`, {
        method: "PATCH",
        token: session?.accessToken,
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isAdvisor: data.is_advisor,
          advisorProfile: data.advisor_profile,
          cvProfile: data.cv_profile,
          createdAt: data.created_at ?? "",
        });
      }
    } catch (error) {
      console.error("Failed to update user", error);
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
