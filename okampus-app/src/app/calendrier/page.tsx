"use client";

import { useState } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: "universitaire" | "national" | "examen" | "vacances" | "autre";
  startDate: string;
  endDate?: string;
  location?: string;
  university?: string;
  color: string;
}

export default function CalendrierPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Données simulées
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Rentrée universitaire 2024-2025",
      description: "Début de l'année académique pour toutes les universités publiques",
      type: "universitaire",
      startDate: "2024-10-15",
      location: "Toutes universités",
      color: "blue",
    },
    {
      id: "2",
      title: "Fête de l'Indépendance",
      description: "Jour férié national - 2 octobre",
      type: "national",
      startDate: "2024-10-02",
      color: "green",
    },
    {
      id: "3",
      title: "Examens 1er semestre",
      description: "Session d'examens pour le premier semestre",
      type: "examen",
      startDate: "2024-12-15",
      endDate: "2024-12-22",
      university: "UGANC",
      color: "red",
    },
    {
      id: "4",
      title: "Vacances de fin d'année",
      description: "Pause académique",
      type: "vacances",
      startDate: "2024-12-23",
      endDate: "2025-01-06",
      color: "purple",
    },
    {
      id: "5",
      title: "Reprise des cours - Semestre 2",
      description: "Début du second semestre",
      type: "universitaire",
      startDate: "2025-01-07",
      location: "Toutes universités",
      color: "blue",
    },
    {
      id: "6",
      title: "Journée de la Femme",
      description: "Jour férié national - 8 mars",
      type: "national",
      startDate: "2025-03-08",
      color: "green",
    },
    {
      id: "7",
      title: "Soutenance projets L3",
      description: "Soutenances des projets de fin d'études",
      type: "universitaire",
      startDate: "2025-05-20",
      endDate: "2025-05-31",
      university: "IPG",
      color: "blue",
    },
    {
      id: "8",
      title: "Examens 2ème semestre",
      description: "Session d'examens pour le second semestre",
      type: "examen",
      startDate: "2025-06-10",
      endDate: "2025-06-20",
      university: "UGANC",
      color: "red",
    },
  ];

  const filteredEvents = events.filter((event) => {
    if (selectedType === "all") return true;
    return event.type === selectedType;
  });

  const typeLabels: Record<string, string> = {
    universitaire: "Universitaire",
    national: "National",
    examen: "Examen",
    vacances: "Vacances",
    autre: "Autre",
  };

  const typeColors: Record<string, string> = {
    universitaire: "bg-red-50 text-[#c41e3a]",
    national: "bg-emerald-50 text-emerald-600",
    examen: "bg-red-50 text-red-600",
    vacances: "bg-violet-50 text-[#9e1830]",
    autre: "bg-slate-50 text-slate-600",
  };

  const typeDotColors: Record<string, string> = {
    universitaire: "bg-[#c41e3a]",
    national: "bg-emerald-500",
    examen: "bg-red-500",
    vacances: "bg-[#9e1830]",
    autre: "bg-slate-400",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-14">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-red-50 text-[#c41e3a] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
            Calendrier
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Calendrier universitaire
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl">
            Tous les événements importants : rentrées, examens, jours fériés
          </p>
        </div>

        {/* Filtres */}
        <div className="card bg-white rounded-2xl border border-slate-200 p-5 md:p-7 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedType === "all"
                  ? "bg-[#c41e3a] text-white shadow-lg shadow-red-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:text-[#c41e3a]"
              }`}
            >
              Tous
            </button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedType === key
                    ? "bg-[#c41e3a] text-white shadow-lg shadow-red-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:text-[#c41e3a]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-5 text-sm text-slate-500">
            <span className="font-bold text-slate-900">{sortedEvents.length}</span> événement{sortedEvents.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Timeline des événements */}
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="card bg-white rounded-2xl border border-slate-200 p-6 md:p-7 hover:shadow-lg hover:border-red-100 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                {/* Date */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-24 text-center md:text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#c41e3a] to-[#9e1830] bg-clip-text text-transparent">
                      {new Date(event.startDate).getDate()}
                    </div>
                    <div className="text-sm text-slate-500 font-medium mt-0.5">
                      {new Date(event.startDate).toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(event.startDate).getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="hidden md:flex flex-col items-center self-stretch py-2">
                  <div className={`w-3 h-3 rounded-full ${typeDotColors[event.type]}`} />
                  <div className="w-px flex-1 bg-slate-200 mt-1" />
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#c41e3a] transition-colors">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-slate-500 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        typeColors[event.type]
                      }`}
                    >
                      {typeLabels[event.type]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {event.endDate ? (
                        <span>
                          Du {formatDate(event.startDate)} au {formatDate(event.endDate)}
                        </span>
                      ) : (
                        <span>{formatDate(event.startDate)}</span>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        {event.location}
                      </div>
                    )}
                    {event.university && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {event.university}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedEvents.length === 0 && (
          <div className="card bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-slate-500 font-medium">Aucun événement trouvé</p>
          </div>
        )}

        {/* Légende */}
        <div className="mt-8 card bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <h3 className="font-bold text-slate-900 mb-5">Légende</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${typeDotColors[key]}`} />
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${typeColors[key as keyof typeof typeColors]}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-sm">
          <Link href="/" className="text-slate-400 hover:text-[#c41e3a] font-medium transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
