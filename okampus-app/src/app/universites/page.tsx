"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import {
  filterInstitutions,
  getInstitutionCities,
  INSTITUTIONS,
  type Institution,
  type InstitutionKind,
  type InstitutionSector,
} from "@/lib/universities";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:border-[#121117] text-base md:text-sm transition-all";

function sectorLabel(sector: InstitutionSector): string {
  return sector === "public" ? "Public" : "Privé";
}

function kindLabel(kind: InstitutionKind): string {
  return kind === "université" ? "Université" : "Institut";
}

function InstitutionCard({ inst }: { inst: Institution }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="card p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                inst.sector === "public"
                  ? "bg-[#e8f5ee] text-[#166534]"
                  : "bg-[#ede9fe] text-[#5b21b6]"
              }`}
            >
              {sectorLabel(inst.sector)}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f4f4f8] text-[#4d4c5c]">
              {kindLabel(inst.kind)}
            </span>
            <span className="text-xs font-medium text-[#6a697c] flex items-center gap-1">
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
              {inst.city}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-[#121117] leading-snug">{inst.name}</h2>
          <p className="text-sm text-[#6a697c] mt-0.5">{inst.shortName}</p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {inst.website && (
            <a
              href={inst.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm !py-2 !px-3"
            >
              Site web
            </a>
          )}
          <Link
            href={`/assistant?q=${encodeURIComponent(`Ou étudier ${inst.filieres[0] || inst.shortName} à ${inst.city} ?`)}`}
            className="btn-primary text-sm !py-2 !px-3"
          >
            Demander à Kampus
          </Link>
        </div>
      </div>

      <p className={`text-sm text-[#4d4c5c] mt-4 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
        {inst.description}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-semibold text-[#121117] underline underline-offset-2"
      >
        {expanded ? "Masquer les details" : "Voir la description complete"}
      </button>

      <div className="mt-4 pt-4 border-t border-[#dcdce5]">
        <p className="text-sm font-semibold text-[#121117] mb-2">
          Principales filières ({inst.filieres.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {(expanded ? inst.filieres : inst.filieres.slice(0, 8)).map((filière) => (
            <span
              key={filière}
              className="text-xs md:text-sm px-2.5 py-1 rounded-md bg-[#f4f4f8] text-[#4d4c5c] border border-[#dcdce5]"
            >
              {filière}
            </span>
          ))}
          {!expanded && inst.filieres.length > 8 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-xs md:text-sm px-2.5 py-1 rounded-md text-[#121117] font-semibold underline underline-offset-2"
            >
              +{inst.filieres.length - 8} autres
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function UniversitésPage() {
  const cities = useMemo(() => getInstitutionCities(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<InstitutionSector | "all">("all");
  const [selectedKind, setSelectedKind] = useState<InstitutionKind | "all">("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () =>
      filterInstitutions({
        query: searchQuery,
        sector: selectedSector,
        kind: selectedKind,
        city: selectedCity,
      }),
    [searchQuery, selectedSector, selectedKind, selectedCity]
  );

  const publicCount = INSTITUTIONS.filter((i) => i.sector === "public").length;
  const privateCount = INSTITUTIONS.filter((i) => i.sector === "privé").length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Orientation"
        title="Universités & Écoles"
        description="Référentiel des établissements d'enseignement supérieur en Guinée — filières, villes et sites officiels."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-[#121117]">{INSTITUTIONS.length}</p>
          <p className="text-sm text-[#6a697c]">Établissements</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-[#166534]">{publicCount}</p>
          <p className="text-sm text-[#6a697c]">Publics</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-[#5b21b6]">{privateCount}</p>
          <p className="text-sm text-[#6a697c]">Privés</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-[#121117]">{cities.length}</p>
          <p className="text-sm text-[#6a697c]">Villes</p>
        </div>
      </div>

      <div className="card p-4 md:p-7 mb-6 md:mb-8">
        <div className="relative mb-3 md:mb-5">
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
            placeholder="Rechercher une université, une filière, une ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#dcdce5] bg-white focus:outline-none focus:border-[#121117] text-base md:text-sm transition-all"
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-3 md:hidden">
          <p className="text-sm text-[#4d4c5c]">
            <span className="font-bold text-[#121117]">{filtered.length}</span> resultat
            {filtered.length > 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="min-h-11 px-3 text-sm font-semibold text-[#121117] underline underline-offset-2"
          >
            {showFilters ? "Masquer filtres" : "Filtres"}
          </button>
        </div>

        <div className={`${showFilters ? "grid" : "hidden"} md:grid md:grid-cols-4 gap-5`}>
          <div>
            <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Statut</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as InstitutionSector | "all")}
              className={inputClass}
            >
              <option value="all">Tous</option>
              <option value="public">Public</option>
              <option value="privé">Privé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Type</label>
            <select
              value={selectedKind}
              onChange={(e) => setSelectedKind(e.target.value as InstitutionKind | "all")}
              className={inputClass}
            >
              <option value="all">Tous</option>
              <option value="université">Universités</option>
              <option value="institut">Instituts</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#4d4c5c] mb-2">Ville</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={inputClass}
            >
              <option value="all">Toutes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex items-end">
            <p className="text-sm text-[#4d4c5c]">
              <span className="font-bold text-[#121117]">{filtered.length}</span> resultat
              {filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun établissement trouvé"
          description="Essaie un autre mot-clé ou réinitialise les filtres."
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} />
          ))}
        </div>
      )}

      <div className="card p-6 mt-8 text-center">
        <h3 className="text-lg font-bold text-[#121117] mb-2">Tu hésites entre plusieurs établissements ?</h3>
        <p className="text-sm text-[#4d4c5c] mb-4 max-w-xl mx-auto">
          Kampus connaît ce référentiel et peut te recommander ou étudier selon ta serie au bac, ta ville et ton
          projet.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/assistant" className="btn-primary text-sm">
            Parler à l&apos;assistant IA
          </Link>
          <Link href="/conseil" className="btn-secondary text-sm">
            Contacter un mentor
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
