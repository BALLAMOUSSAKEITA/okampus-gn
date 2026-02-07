"use client";

import { useState } from "react";
import Link from "next/link";

interface StageOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "stage" | "job_etudiant" | "alternance";
  domain: string;
  description: string;
  duration?: string;
  remuneration?: string;
  contactEmail?: string;
  contactPhone?: string;
  externalLink?: string;
}

export default function StagesPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<StageOffer | null>(null);

  // Données simulées (seront en BDD)
  const offers: StageOffer[] = [
    {
      id: "1",
      title: "Stage développement web",
      company: "Orange Guinée",
      location: "Conakry",
      type: "stage",
      domain: "Informatique",
      description: "Développement d'une application web pour la gestion interne. Vous travaillerez avec React, Node.js et PostgreSQL.",
      duration: "3 mois",
      remuneration: "200 000 GNF/mois",
      contactEmail: "recrutement@orange-guinee.com",
    },
    {
      id: "2",
      title: "Assistant comptable",
      company: "BCRG",
      location: "Conakry",
      type: "stage",
      domain: "Finance",
      description: "Assistance aux opérations comptables quotidiennes, préparation de rapports financiers.",
      duration: "2 mois",
      remuneration: "150 000 GNF/mois",
      contactEmail: "stages@bcrg.gov.gn",
    },
    {
      id: "3",
      title: "Job étudiant - Caissier",
      company: "Leader Price",
      location: "Kipé, Conakry",
      type: "job_etudiant",
      domain: "Commerce",
      description: "Travail à temps partiel (soirs et weekends). Accueil clients, gestion caisse.",
      duration: "Flexible",
      remuneration: "50 000 GNF/jour",
      contactPhone: "+224 621 00 00 00",
    },
    {
      id: "4",
      title: "Alternance ingénieur réseau",
      company: "MTN Guinée",
      location: "Conakry",
      type: "alternance",
      domain: "Télécommunications",
      description: "Formation en alternance sur la maintenance et l'optimisation des réseaux télécoms.",
      duration: "1 an",
      remuneration: "400 000 GNF/mois",
      contactEmail: "talent@mtn.gn",
      externalLink: "https://mtn.gn/carrieres",
    },
    {
      id: "5",
      title: "Stage infirmier",
      company: "Hôpital National Donka",
      location: "Donka, Conakry",
      type: "stage",
      domain: "Santé",
      description: "Stage d'observation et d'apprentissage en milieu hospitalier.",
      duration: "1 mois",
      remuneration: "Non rémunéré",
      contactEmail: "rh@hopital-donka.gn",
    },
  ];

  const filteredOffers = offers.filter((offer) => {
    const matchType = selectedType === "all" || offer.type === selectedType;
    const matchDomain = selectedDomain === "all" || offer.domain === selectedDomain;
    const matchSearch =
      searchQuery === "" ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchDomain && matchSearch;
  });

  const domains = Array.from(new Set(offers.map((o) => o.domain)));

  const typeLabels: Record<string, string> = {
    stage: "Stage",
    job_etudiant: "Job étudiant",
    alternance: "Alternance",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Offres de stage & emploi
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Trouve ton stage, job étudiant ou alternance en Guinée
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Rechercher par titre ou entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              >
                <option value="all">Tous</option>
                <option value="stage">Stages</option>
                <option value="job_etudiant">Jobs étudiants</option>
                <option value="alternance">Alternances</option>
              </select>
            </div>

            {/* Domaine */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Domaine</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              >
                <option value="all">Tous</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Résultats */}
            <div className="flex items-end">
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{filteredOffers.length}</span> offre{filteredOffers.length > 1 ? "s" : ""} trouvée{filteredOffers.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    offer.type === "stage"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : offer.type === "job_etudiant"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-violet-50 text-violet-700 border border-violet-200"
                  }`}
                >
                  {typeLabels[offer.type]}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{offer.title}</h3>
              <p className="text-sm font-medium text-slate-700 mb-1">{offer.company}</p>
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {offer.location}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">{offer.domain}</span>
                {offer.remuneration && (
                  <span className="font-bold text-emerald-600">{offer.remuneration}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Aucune offre trouvée avec ces critères</p>
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link href="/parcours" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour au parcours
          </Link>
        </div>
      </div>

      {/* Modal détails offre */}
      {selectedOffer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="bg-white w-full md:max-w-2xl md:rounded-xl overflow-hidden rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    selectedOffer.type === "stage"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : selectedOffer.type === "job_etudiant"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-violet-50 text-violet-700 border border-violet-200"
                  }`}
                >
                  {typeLabels[selectedOffer.type]}
                </span>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{selectedOffer.title}</h2>
              <p className="text-sm font-medium text-slate-700">{selectedOffer.company}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedOffer.location}
              </p>
            </div>

            {/* Contenu */}
            <div className="p-5 md:p-6 space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedOffer.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {selectedOffer.duration && (
                  <div>
                    <span className="text-slate-600">Durée :</span>
                    <span className="ml-2 font-medium text-slate-900">{selectedOffer.duration}</span>
                  </div>
                )}
                {selectedOffer.remuneration && (
                  <div>
                    <span className="text-slate-600">Rémunération :</span>
                    <span className="ml-2 font-bold text-emerald-600">{selectedOffer.remuneration}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-600">Domaine :</span>
                  <span className="ml-2 font-medium text-slate-900">{selectedOffer.domain}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3">Contact</h4>
                <div className="space-y-2 text-sm">
                  {selectedOffer.contactEmail && (
                    <a
                      href={`mailto:${selectedOffer.contactEmail}`}
                      className="flex items-center gap-2 text-[#c41e3a] hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedOffer.contactEmail}
                    </a>
                  )}
                  {selectedOffer.contactPhone && (
                    <a
                      href={`tel:${selectedOffer.contactPhone}`}
                      className="flex items-center gap-2 text-[#c41e3a] hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedOffer.contactPhone}
                    </a>
                  )}
                  {selectedOffer.externalLink && (
                    <a
                      href={selectedOffer.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#c41e3a] hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Postuler en ligne
                    </a>
                  )}
                </div>
              </div>

              {/* Bouton candidater */}
              <button className="w-full bg-[#c41e3a] text-white py-3 rounded-lg font-medium hover:bg-[#a01828] transition-colors">
                Postuler à cette offre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
