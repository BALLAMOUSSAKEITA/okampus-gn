"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Données simulées
  const scholarships: Scholarship[] = [
    {
      id: "1",
      title: "Bourse d'Excellence du Gouvernement Guinéen",
      type: "bourse",
      organization: "Ministère de l'Enseignement Supérieur",
      description: "Bourse complète pour les meilleurs bacheliers guinéens : frais de scolarité, allocation mensuelle, hébergement.",
      eligibility: "Moyenne générale >= 14 au bac, nationalité guinéenne",
      amount: "Frais de scolarité + 1 500 000 GNF/an",
      deadline: "2024-10-15",
      contactInfo: "bourses@mesrs.gov.gn",
      domain: "Tous",
      location: "Guinée",
    },
    {
      id: "2",
      title: "Bourse Mastercard Foundation",
      type: "bourse",
      organization: "Mastercard Foundation",
      description: "Programme de bourses pour étudiants africains talentueux issus de milieux défavorisés. Couvre études, logement, voyage.",
      eligibility: "Excellence académique, leadership, situation financière difficile",
      amount: "Bourse complète",
      deadline: "2024-12-01",
      applyLink: "https://mastercardfdn.org/scholarships",
      domain: "Tous",
      location: "International",
    },
    {
      id: "3",
      title: "Concours d'entrée à l'École Nationale d'Administration",
      type: "concours",
      organization: "ENA Guinée",
      description: "Concours national pour intégrer l'ENA. Formation gratuite pour devenir administrateur civil.",
      eligibility: "Bac+3 minimum, âge <= 30 ans",
      deadline: "2024-09-30",
      contactInfo: "+224 621 00 00 00",
      domain: "Administration",
      location: "Guinée",
    },
    {
      id: "4",
      title: "Bourse Campus France",
      type: "bourse",
      organization: "Ambassade de France",
      description: "Bourses pour études en France (Master, Doctorat) dans toutes les disciplines.",
      eligibility: "Dossier académique solide, projet d'études clair",
      amount: "Variable selon niveau",
      deadline: "2025-01-31",
      applyLink: "https://campusfrance.org",
      domain: "Tous",
      location: "France",
    },
    {
      id: "5",
      title: "Concours Grandes Écoles d'Ingénieurs",
      type: "concours",
      organization: "Réseau écoles d'ingénieurs",
      description: "Concours commun pour plusieurs écoles d'ingénieurs guinéennes et africaines.",
      eligibility: "Bac S, C ou D",
      deadline: "2024-11-15",
      contactInfo: "concours@ecoles-gn.org",
      domain: "Sciences & Technologies",
      location: "Guinée",
    },
    {
      id: "6",
      title: "Bourse African Union Scholarship",
      type: "bourse",
      organization: "Union Africaine",
      description: "Bourse pour Master ou Doctorat dans une université africaine partenaire.",
      eligibility: "Citoyen africain, excellence académique",
      amount: "Frais de scolarité + allocation",
      deadline: "2024-10-30",
      applyLink: "https://au.int/scholarships",
      domain: "Tous",
      location: "Afrique",
    },
  ];

  const filteredScholarships = scholarships.filter((sch) => {
    const matchType = selectedType === "all" || sch.type === selectedType;
    const matchLocation = selectedLocation === "all" || sch.location === selectedLocation;
    const matchSearch =
      searchQuery === "" ||
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchLocation && matchSearch;
  });

  const locations = Array.from(new Set(scholarships.map((s) => s.location)));

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Bourses & Concours
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Toutes les opportunités de bourses d'études et concours disponibles
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Rechercher une bourse ou un concours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
              >
                <option value="all">Tous</option>
                <option value="bourse">Bourses</option>
                <option value="concours">Concours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] text-sm"
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
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{filteredScholarships.length}</span> opportunité{filteredScholarships.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Contenu principal */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                        scholarship.type === "bourse"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {scholarship.type === "bourse" ? "Bourse" : "Concours"}
                    </span>
                    <span className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-md text-xs font-medium">
                      {scholarship.location}
                    </span>
                    {scholarship.deadline && isDeadlineSoon(scholarship.deadline) && (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-bold animate-pulse">
                        Date limite proche !
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{scholarship.title}</h3>
                  <p className="text-sm font-medium text-slate-700 mb-2">{scholarship.organization}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{scholarship.description}</p>

                  {/* Détails */}
                  <div className="space-y-2 text-sm">
                    {scholarship.eligibility && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="font-medium text-slate-700">Éligibilité :</span>
                          <span className="text-slate-600 ml-1">{scholarship.eligibility}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.amount && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-medium text-slate-700">Montant :</span>
                          <span className="text-emerald-600 font-bold ml-1">{scholarship.amount}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.deadline && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="font-medium text-slate-700">Date limite :</span>
                          <span className="text-slate-600 ml-1">{formatDeadline(scholarship.deadline)}</span>
                        </div>
                      </div>
                    )}
                    {scholarship.domain && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <span className="font-medium text-slate-700">Domaine :</span>
                          <span className="text-slate-600 ml-1">{scholarship.domain}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
                  {scholarship.applyLink && (
                    <a
                      href={scholarship.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-[#c41e3a] text-white rounded-lg font-medium hover:bg-[#a01828] transition-colors text-center text-sm"
                    >
                      Postuler en ligne
                    </a>
                  )}
                  {scholarship.contactInfo && (
                    <a
                      href={scholarship.contactInfo.includes("@") ? `mailto:${scholarship.contactInfo}` : `tel:${scholarship.contactInfo}`}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-center text-sm"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Aucune opportunité trouvée</p>
          </div>
        )}

        <div className="mt-8 text-sm">
          <Link href="/" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
