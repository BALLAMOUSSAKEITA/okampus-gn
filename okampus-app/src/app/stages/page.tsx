"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

type ApiStageOffer = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  domain: string;
  description: string;
  requirements?: string | null;
  duration?: string | null;
  remuneration?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  external_link?: string | null;
};

interface StageOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  domain: string;
  description: string;
  requirements?: string;
  duration?: string;
  remuneration?: string;
  contactEmail?: string;
  contactPhone?: string;
  externalLink?: string;
}

function mapOffer(raw: ApiStageOffer): StageOffer {
  return {
    id: raw.id,
    title: raw.title,
    company: raw.company,
    location: raw.location,
    type: raw.type,
    domain: raw.domain,
    description: raw.description,
    requirements: raw.requirements ?? undefined,
    duration: raw.duration ?? undefined,
    remuneration: raw.remuneration ?? undefined,
    contactEmail: raw.contact_email ?? undefined,
    contactPhone: raw.contact_phone ?? undefined,
    externalLink: raw.external_link ?? undefined,
  };
}

function typeBadgeClass(type: string) {
  const t = type.toLowerCase();
  if (t.includes("job")) return "bg-emerald-50 text-emerald-600";
  if (t.includes("altern")) return "bg-violet-50 text-[#4d4c5c]";
  return "bg-[#f4f4f8] text-[#121117]";
}

export default function StagesPage() {
  const [offers, setOffers] = useState<StageOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<StageOffer | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/stages`);
        if (!res.ok) throw new Error("Impossible de charger les offres");
        const data = (await res.json()) as ApiStageOffer[];
        setOffers(data.map(mapOffer));
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const types = useMemo(
    () => Array.from(new Set(offers.map((o) => o.type))).sort(),
    [offers]
  );

  const domains = useMemo(
    () => Array.from(new Set(offers.map((o) => o.domain))).sort(),
    [offers]
  );

  const filteredOffers = offers.filter((offer) => {
    const matchType = selectedType === "all" || offer.type === selectedType;
    const matchDomain = selectedDomain === "all" || offer.domain === selectedDomain;
    const matchSearch =
      searchQuery === "" ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchDomain && matchSearch;
  });

  return (
    <>
      <PageShell>
        <PageHeader
          eyebrow="Opportunites"
          title="Offres de stage & emploi"
          description="Trouve ton stage, job etudiant ou alternance pres de chez toi"
        />

        {fetchError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {fetchError}
          </div>
        )}

        {!loading && offers.length === 0 && !fetchError ? (
          <EmptyState
            title="Aucune offre pour le moment"
            description="Les offres de stage et d'emploi seront bientot publiees ici. Reviens regulierement ou consulte les autres sections de la plateforme."
            action={
              <Link href="/" className="btn-primary">
                Retour a l&apos;accueil
              </Link>
            }
          />
        ) : (
          <>
            <div className="card p-5 md:p-7 mb-8">
              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-3">
                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6a697c]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher par titre ou entreprise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm disabled:opacity-50"
                  >
                    <option value="all">Tous</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Domaine</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:ring-2 focus:ring-[#121117]/20 focus:border-[#121117] text-sm disabled:opacity-50"
                  >
                    <option value="all">Tous</option>
                    {domains.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-[#4d4c5c]">
                    {loading ? (
                      "Chargement..."
                    ) : (
                      <>
                        <span className="font-bold text-[#121117]">{filteredOffers.length}</span>{" "}
                        offre{filteredOffers.length > 1 ? "s" : ""} trouvee
                        {filteredOffers.length > 1 ? "s" : ""}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="card p-16 text-center text-[#6a697c] text-sm">Chargement des offres...</div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="card p-6 hover:border-[#121117]/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeClass(offer.type)}`}
                        >
                          {offer.type}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#121117] mb-2 line-clamp-2 group-hover:text-[#121117] transition-colors">
                        {offer.title}
                      </h3>
                      <p className="text-sm font-medium text-[#4d4c5c] mb-1">{offer.company}</p>
                      <p className="text-xs text-[#6a697c] mb-4 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {offer.location}
                      </p>

                      <div className="pt-4 border-t border-[#dcdce5] flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 bg-[#f4f4f8] text-[#4d4c5c] rounded-full font-medium">
                          {offer.domain}
                        </span>
                        {offer.remuneration && (
                          <span className="font-bold text-emerald-600">{offer.remuneration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredOffers.length === 0 && offers.length > 0 && (
                  <EmptyState
                    title="Aucune offre avec ces criteres"
                    description="Essaie de modifier ta recherche ou tes filtres pour voir plus de resultats."
                  />
                )}
              </>
            )}
          </>
        )}

        <div className="mt-10 text-sm">
          <Link href="/parcours" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour au parcours
          </Link>
        </div>
      </PageShell>

      {selectedOffer && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-2xl overflow-hidden rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-[#121117]" />

            <div className="p-6 md:p-8 border-b border-[#dcdce5] bg-white">
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeClass(selectedOffer.type)}`}
                >
                  {selectedOffer.type}
                </span>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="w-8 h-8 rounded-full bg-[#f4f4f8] flex items-center justify-center text-[#6a697c] hover:text-[#4d4c5c] hover:bg-[#dcdce5] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#121117] mb-2">{selectedOffer.title}</h2>
              <p className="text-sm font-medium text-[#4d4c5c]">{selectedOffer.company}</p>
              <p className="text-xs text-[#6a697c] flex items-center gap-1.5 mt-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {selectedOffer.location}
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h4 className="font-bold text-[#121117] mb-2">Description</h4>
                <p className="text-sm text-[#4d4c5c] leading-relaxed">{selectedOffer.description}</p>
              </div>

              {selectedOffer.requirements && (
                <div>
                  <h4 className="font-bold text-[#121117] mb-2">Prerequis</h4>
                  <p className="text-sm text-[#4d4c5c] leading-relaxed">{selectedOffer.requirements}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {selectedOffer.duration && (
                  <div className="p-3 bg-[#f4f4f8] rounded-lg">
                    <span className="text-[#6a697c] text-xs">Duree</span>
                    <p className="font-semibold text-[#121117] mt-0.5">{selectedOffer.duration}</p>
                  </div>
                )}
                {selectedOffer.remuneration && (
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-500 text-xs">Remuneration</span>
                    <p className="font-bold text-emerald-600 mt-0.5">{selectedOffer.remuneration}</p>
                  </div>
                )}
                <div className="p-3 bg-[#f4f4f8] rounded-lg">
                  <span className="text-[#6a697c] text-xs">Domaine</span>
                  <p className="font-semibold text-[#121117] mt-0.5">{selectedOffer.domain}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-[#dcdce5]">
                <h4 className="font-bold text-[#121117] mb-4">Contact</h4>
                <div className="space-y-3 text-sm">
                  {selectedOffer.contactEmail && (
                    <a
                      href={`mailto:${selectedOffer.contactEmail}`}
                      className="flex items-center gap-3 text-[#121117] hover:text-[#4d4c5c] transition-colors p-2.5 rounded-lg hover:bg-[#f4f4f8]"
                    >
                      {selectedOffer.contactEmail}
                    </a>
                  )}
                  {selectedOffer.contactPhone && (
                    <a
                      href={`tel:${selectedOffer.contactPhone}`}
                      className="flex items-center gap-3 text-[#121117] hover:text-[#4d4c5c] transition-colors p-2.5 rounded-lg hover:bg-[#f4f4f8]"
                    >
                      {selectedOffer.contactPhone}
                    </a>
                  )}
                  {selectedOffer.externalLink && (
                    <a
                      href={selectedOffer.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#121117] hover:text-[#4d4c5c] transition-colors p-2.5 rounded-lg hover:bg-[#f4f4f8]"
                    >
                      Postuler en ligne
                    </a>
                  )}
                  {!selectedOffer.contactEmail &&
                    !selectedOffer.contactPhone &&
                    !selectedOffer.externalLink && (
                      <p className="text-[#6a697c]">Contact non renseigne pour cette offre.</p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
