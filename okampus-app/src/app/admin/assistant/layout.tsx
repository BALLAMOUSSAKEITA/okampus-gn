"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/assistant", label: "Consommation", exact: true },
  { href: "/admin/assistant/conversations", label: "Conversations", exact: false },
];

export default function AdminAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <nav className="flex gap-2 mb-6 border-b border-[#e5e5e5] pb-0">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-[#737373] hover:text-[#121117]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
