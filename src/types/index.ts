export type UserRole = "bachelier" | "etudiant";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAdvisor?: boolean;
  advisorProfile?: AdvisorProfile;
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
