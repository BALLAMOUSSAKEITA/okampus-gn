"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f4f4f8]">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-6 sm:p-8 overflow-x-auto">{children}</div>
      </div>
    </AdminGuard>
  );
}
