"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="admin-theme min-h-screen">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
