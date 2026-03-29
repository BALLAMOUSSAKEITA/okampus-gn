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
    universitaire: "bg-blue-50 text-blue-700 border-blue-200",
    national: "bg-emerald-50 text-emerald-700 border-emerald-200",
    examen: "bg-red-50 text-red-700 border-red-200",
    vacances: "bg-purple-50 text-purple-700 border-purple-200",
    autre: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Calendrier universitaire
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Tous les événements importants : rentrées, examens, jours fériés
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === "all"
                  ? "bg-[#c41e3a] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tous
            </button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === key
                    ? "bg-[#c41e3a] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <span className="font-bold text-slate-900">{sortedEvents.length}</span> événement{sortedEvents.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Timeline des événements */}
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Date */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-20 text-center">
                    <div className="text-3xl font-bold text-[#c41e3a]">
                      {new Date(event.startDate).getDate()}
                    </div>
                    <div className="text-sm text-slate-600">
                      {new Date(event.startDate).toLocaleDateString("fr-FR", { month: "short" })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(event.startDate).getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="hidden md:block w-px bg-slate-200 self-stretch" />

                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-slate-600">{event.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border whitespace-nowrap ${
                        typeColors[event.type]
                      }`}
                    >
                      {typeLabels[event.type]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Aucun événement trouvé</p>
          </div>
        )}

        {/* Légende */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5 md:p-6">
          <h3 className="font-bold text-slate-900 mb-4">Légende</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-md text-xs font-medium border ${typeColors[key as keyof typeof typeColors]}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-sm">
          <Link href="/" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
