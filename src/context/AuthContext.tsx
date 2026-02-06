"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, role: UserRole) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "okampus_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.email === email) {
        setUser(parsed);
        return true;
      }
    }
    return false;
  };

  const register = (
    email: string,
    _password: string,
    name: string,
    role: UserRole
  ) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      isAdvisor: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoaded, login, register, logout, updateUser }}
    >
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
