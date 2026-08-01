"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  link?: string | null;
  category: string;
  published_at: string;
};

const CATEGORY_STYLES: Record<string, string> = {
  Actualité: "bg-[#dbeafe] text-[#1d4ed8]",
  Événement: "bg-[#ffedd5] text-[#c2410c]",
  Bourse: "bg-[#ede9fe] text-[#6d28d9]",
  Plateforme: "bg-[#dcfce7] text-[#15803d]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function NewsLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export function LandingNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/news?limit=4`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="bg-white py-12 sm:py-14 px-4 sm:px-6 border-b border-[#dcdce5]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <span className="sticker-label rotate-[-1deg] mb-3 inline-block">À la une</span>
            <h2 className="font-display text-[28px] sm:text-[34px] font-bold leading-[1.13] text-[#121117]">
              Actualités & nouveautés
            </h2>
            <p className="mt-2 text-[#4d4c5c]">
              Dates importantes, opportunités et nouveautés sur BacheliO
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const badgeClass =
              CATEGORY_STYLES[item.category] ?? "bg-[#f4f4f8] text-[#4d4c5c]";
            const card = (
              <article className="card h-full p-5 flex flex-col group hover:border-[#121117]/20 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${badgeClass}`}>
                    {item.category}
                  </span>
                  <time className="text-[11px] text-[#6a697c] shrink-0">
                    {formatDate(item.published_at)}
                  </time>
                </div>
                <h3 className="font-display text-lg font-bold text-[#121117] leading-snug group-hover:underline underline-offset-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#4d4c5c] leading-relaxed line-clamp-3 flex-1">
                  {item.summary}
                </p>
                {item.link && (
                  <span className="mt-4 text-sm font-semibold text-[#121117] inline-flex items-center gap-1">
                    En savoir plus
                    <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                )}
              </article>
            );

            if (item.link) {
              return (
                <NewsLink key={item.id} href={item.link} className="block h-full">
                  {card}
                </NewsLink>
              );
            }

            return <div key={item.id}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
