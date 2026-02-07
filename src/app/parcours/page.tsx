"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Objectif {
  id: string;
  titre: string;
  description: string;
  statut: "en_cours" | "termine" | "abandonne";
  semestre: string;
}

interface Note {
  id: string;
  matiere: string;
  note: number;
  coefficient: number;
  semestre: string;
}

export default function ParcoursPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "objectifs">("overview");

  // Données simulées (seront en BDD plus tard)
  const [objectifs] = useState<Objectif[]>([
    { id: "1", titre: "Valider le 1er semestre", description: "Obtenir une moyenne >= 12", statut: "en_cours", semestre: "S1" },
    { id: "2", titre: "Stage d'observation", description: "Trouver un stage de 2 semaines", statut: "en_cours", semestre: "S2" },
    { id: "3", titre: "Projet de groupe", description: "Réaliser le projet de fin de semestre", statut: "en_cours", semestre: "S1" },
  ]);

  const [notes] = useState<Note[]>([
    { id: "1", matiere: "Mathématiques", note: 14, coefficient: 4, semestre: "S1" },
    { id: "2", matiere: "Physique", note: 12, coefficient: 3, semestre: "S1" },
    { id: "3", matiere: "Informatique", note: 16, coefficient: 3, semestre: "S1" },
    { id: "4", matiere: "Anglais", note: 13, coefficient: 2, semestre: "S1" },
  ]);

  const moyenne = useMemo(() => {
    if (notes.length === 0) return 0;
    const total = notes.reduce((acc, n) => acc + n.note * n.coefficient, 0);
    const totalCoef = notes.reduce((acc, n) => acc + n.coefficient, 0);
    return totalCoef > 0 ? (total / totalCoef).toFixed(2) : "0";
  }, [notes]);

  const objectifsEnCours = objectifs.filter((o) => o.statut === "en_cours").length;
  const objectifsTermines = objectifs.filter((o) => o.statut === "termine").length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/inscription");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Mon parcours
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Suis ta progression, tes notes et tes objectifs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { id: "overview", label: "Vue d'ensemble" },
            { id: "notes", label: "Notes" },
            { id: "objectifs", label: "Objectifs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#c41e3a] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === "overview" && (
          <div className="space-y-4 md:space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: "Moyenne générale", value: moyenne, color: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Objectifs en cours", value: objectifsEnCours, color: "bg-amber-50 border-amber-200 text-amber-700" },
                { label: "Objectifs terminés", value: objectifsTermines, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                { label: "Semestre", value: "S1", color: "bg-violet-50 border-violet-200 text-violet-700" },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border p-4 ${stat.color}`}>
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Informations parcours */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-bold text-slate-900 mb-4">Informations</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Université :</span>
                  <span className="ml-2 font-medium text-slate-900">UGANC</span>
                </div>
                <div>
                  <span className="text-slate-600">Filière :</span>
                  <span className="ml-2 font-medium text-slate-900">Informatique</span>
                </div>
                <div>
                  <span className="text-slate-600">Année :</span>
                  <span className="ml-2 font-medium text-slate-900">1ère année</span>
                </div>
                <div>
                  <span className="text-slate-600">Statut :</span>
                  <span className="ml-2 font-medium text-emerald-600">Actif</span>
                </div>
              </div>
            </div>

            {/* Prochains objectifs */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
              <h3 className="font-bold text-slate-900 mb-4">Prochains objectifs</h3>
              <div className="space-y-3">
                {objectifs.filter((o) => o.statut === "en_cours").slice(0, 3).map((obj) => (
                  <div key={obj.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-xs flex-shrink-0">
                      {obj.semestre}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{obj.titre}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{obj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Mes notes</h3>
                <span className="text-sm text-slate-600">Moyenne : <span className="font-bold text-slate-900">{moyenne}</span></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 font-semibold text-slate-700">Matière</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Note</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Coef.</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Semestre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50">
                      <td className="px-4 md:px-6 py-3 font-medium text-slate-900">{note.matiere}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${note.note >= 12 ? "text-emerald-600" : note.note >= 10 ? "text-amber-600" : "text-red-600"}`}>
                          {note.note}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">{note.coefficient}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{note.semestre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Objectifs */}
        {activeTab === "objectifs" && (
          <div className="space-y-3 md:space-y-4">
            {objectifs.map((obj) => (
              <div key={obj.id} className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {obj.semestre}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          obj.statut === "termine"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : obj.statut === "en_cours"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {obj.statut === "termine" ? "Terminé" : obj.statut === "en_cours" ? "En cours" : "Abandonné"}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{obj.titre}</h4>
                    <p className="text-sm text-slate-600">{obj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/profil" className="text-slate-600 hover:text-[#c41e3a] font-medium">
            ← Retour au profil
          </Link>
          <Link href="/stages" className="text-violet-600 hover:underline font-medium">
            → Voir les offres de stage
          </Link>
        </div>
      </div>
    </div>
  );
}
