"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, isLoaded } = useAuth();

  const isAdmin =
    user?.role === "admin" || session?.user?.role === "admin";

  useEffect(() => {
    if (status === "loading" || !isLoaded) return;
    if (!session?.user && !user) {
      router.replace("/inscription?callbackUrl=/admin");
      return;
    }
    if (!isAdmin) {
      router.replace("/profil");
    }
  }, [session, user, status, isLoaded, isAdmin, router]);

  if (status === "loading" || !isLoaded || !isAdmin) {
    return (
      <div className="admin-theme admin-loading">
        Verification des droits admin...
      </div>
    );
  }

  return <>{children}</>;
}
