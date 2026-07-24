"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm transition-all";

interface Scholarship {
  id: string;
  title: string;
  type: "bourse" | "concours";
  organization: string;
  description: string;
  eligibility?: string;
  amount?: string;
  deadline?: string;
  applyLink?: string;
  contactInfo?: string;
  domain?: string;
  location: string;
}

export default function BoursesPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/scholarships`);
        if (!res.ok) throw new Error("Impossible de charger les bourses");
        const data = (await res.json()) as Array<{
          id: string;
          title: string;
          type: string;
          organization: string;
          description: string;
          eligibility?: string | null;
          amount?: string | null;
          deadline?: string | null;
          apply_link?: string | null;
          contact_info?: string | null;
          domain?: string | null;
          location?: string | null;
        }>;
        setScholarships(
          data.map((s) => ({
            id: s.id,
            title: s.title,
            type: s.type.toLowerCase().includes("concours") ? "concours" : "bourse",
            organization: s.organization,
            description: s.description,
            eligibility: s.eligibility ?? undefined,
            amount: s.amount ?? undefined,
            deadline: s.deadline ?? undefined,
            applyLink: s.apply_link ?? undefined,
            contactInfo: s.contact_info ?? undefined,
            domain: s.domain ?? undefined,
            location: s.location ?? "Non specifiee",
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(scholarships.map((s) => s.location))).sort(),
    [scholarships]
  );

  const filteredScholarships = scholarships.filter((sch) => {
    const matchType = selectedType === "all" || sch.type === selectedType;
    const matchLocation = selectedLocation === "all" || sch.location === selectedLocation;
    const matchSearch =
      searchQuery === "" ||
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchLocation && matchSearch;
  });

  const formatDeadline = (dateStr?: string) => {
    if (!dateStr) return "Non spécifiée";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const isDeadlineSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const deadline = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Opportunites"
        title="Bourses & Concours"
        description="Toutes les opportunites de bourses d'etudes et concours disponibles"
      />

        {/* Filtres */}
        <div className="card p-5 md:p-7 mb-8">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher une bourse ou un concours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={inputClass}
              >
                <option value="all">Tous</option>
                <option value="bourse">Bourses</option>
                <option value="concours">Concours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Localisation</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={inputClass}
              >
                <option value="all">Toutes</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-[#4d4c5c]">
                <span className="font-bold text-[#121117]">{filteredScholarships.length}</span> opportunité{filteredScholarships.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
        ) : fetchError ? (
          <EmptyState title="Erreur de chargement" description={fetchError} />
        ) : scholarships.length === 0 ? (
          <EmptyState
            title="Aucune bourse pour le moment"
            description="Les opportunites seront publiees ici des qu'elles seront disponibles."
          />
        ) : (
        <>
        <div className="space-y-5">
          {filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="card p-6 md:p-8 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Contenu principal */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-2 mb-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        scholarship.type === "bourse"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-[#ffdf3d] text-[#121117]"
                      }`}
                    >
                      {scholarship.type === "bourse" ? "Bourse" : "Concours"}
                    </span>
                    <span className="px-3 py-1.5 bg-[#f4f4f8] text-[#4d4c5c] rounded-full text-xs font-semibold">
                      {scholarship.location}
                    </span>
                    {scholarship.deadline && isDeadlineSoon(scholarship.deadline) && (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold animate-pulse">
                        Date limite proche !
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#121117] mb-2 group-hover:text-[#121117] transition-colors">{scholarship.title}</h3>
                  <p className="text-sm font-medium text-[#4d4c5c] mb-2">{scholarship.organization}</p>
                  <p className="text-sm text-[#4d4c5c] leading-relaxed mb-5">{scholarship.description}</p>

                  {/* Détails */}
                  <div className="space-y-3 text-sm">
                    {scholarship.eligibility && (
                      <div className="flex items-start gap-3 p-3 bg-[#f4f4f8] rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-[#f4f4f8] border border-[#dcdce5] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4d4c5c]">Éligibilité :</span>
                          <span className="text-[#6a697c] ml-1">{scholarship.eligibility}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.amount && (
                      <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4d4c5c]">Montant :</span>
                          <span className="text-emerald-600 font-bold ml-1">{scholarship.amount}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.deadline && (
                      <div className="flex items-start gap-3 p-3 bg-[#f4f4f8] rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4d4c5c]">Date limite :</span>
                          <span className="text-[#4d4c5c] ml-1">{formatDeadline(scholarship.deadline)}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.domain && (
                      <div className="flex items-start gap-3 p-3 bg-[#f4f4f8] rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#4d4c5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4d4c5c]">Domaine :</span>
                          <span className="text-[#4d4c5c] ml-1">{scholarship.domain}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-3 lg:w-52">
                  {scholarship.applyLink && (
                    <a
                      href={scholarship.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 lg:flex-none px-5 py-3 text-center text-sm"
                    >
                      Postuler en ligne
                    </a>
                  )}
                  {scholarship.contactInfo && (
                    <a
                      href={scholarship.contactInfo.includes("@") ? `mailto:${scholarship.contactInfo}` : `tel:${scholarship.contactInfo}`}
                      className="btn-secondary flex-1 lg:flex-none px-5 py-3 text-center text-sm"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && scholarships.length > 0 && (
          <EmptyState
            title="Aucune opportunite avec ces criteres"
            description="Essaie de modifier tes filtres ou ta recherche."
          />
        )}
        </>
        )}

        <div className="mt-10 text-sm">
          <Link href="/" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
    </PageShell>
  );
}
