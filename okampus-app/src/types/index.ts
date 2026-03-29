export type UserRole = "bachelier" | "etudiant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAdvisor?: boolean;
  advisorProfile?: AdvisorProfile;
  cvProfile?: CvProfile;
  createdAt: string;
}

export interface CvProfile {
  phone?: string;
  location?: string;
  headline?: string; // ex: "Étudiant en Informatique"
  about?: string;
  skills: string[];
  languages: string[]; // ex: "Français (courant)"
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
    start?: string; // ex: "2024-06"
    end?: string; // ex: "2024-09" ou "Présent"
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    description?: string;
    link?: string;
    bullets: string[];
  }>;
}

export interface AdvisorProfile {
  field: string;
  university: string;
  year: string;
  description: string;
  meetLink?: string;
  availableSlots: string[];
}

export interface Advisor extends AdvisorProfile {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface Appointment {
  id: string;
  advisorId: string;
  userId: string;
  date: string;
  time: string;
  meetLink: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface OrientationProfile {
  projectEtudes: string;
  forces: string[];
  faiblesses: string[];
  notes: { matiere: string; note: number; coefficient?: number }[];
  serieBac: string;
  passions: string[];
}
