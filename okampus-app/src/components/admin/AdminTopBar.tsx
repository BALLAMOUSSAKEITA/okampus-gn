"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminTopBar() {
  const { data: session } = useSession();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <div className="admin-topbar-meta">
          <span className="admin-pill admin-pill-blue">Administration</span>
          <span className="admin-topbar-sub">BacheliO — gestion plateforme</span>
        </div>
        <div className="admin-topbar-actions">
          <Link href="/" className="admin-btn-ghost">
            Voir le site
          </Link>
          <span className="admin-topbar-user">{session?.user?.name ?? "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
