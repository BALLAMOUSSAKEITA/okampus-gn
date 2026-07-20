"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

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

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/inscription?callbackUrl=/parcours");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8]">
        <div className="animate-pulse text-[#6a697c] text-sm font-medium">Chargement...</div>
      </div>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Parcours academique"
        title="Mon parcours"
        description="Suis ta progression, tes notes et tes objectifs"
      />

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { id: "overview", label: "Vue d'ensemble" },
            { id: "notes", label: "Notes" },
            { id: "objectifs", label: "Objectifs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#121117] text-white"
                  : "bg-white border border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117]/30 hover:text-[#121117]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === "overview" && (
          <div className="space-y-6 md:space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[
                { label: "Moyenne generale", value: moyenne, bgClass: "bg-[#f4f4f8]", textClass: "text-[#121117]", borderClass: "border-[#dcdce5]" },
                { label: "Objectifs en cours", value: objectifsEnCours, bgClass: "bg-amber-50", textClass: "text-amber-600", borderClass: "border-amber-100" },
                { label: "Objectifs termines", value: objectifsTermines, bgClass: "bg-emerald-50", textClass: "text-emerald-600", borderClass: "border-emerald-100" },
                { label: "Semestre", value: "S1", bgClass: "bg-violet-50", textClass: "text-[#4d4c5c]", borderClass: "border-violet-100" },
              ].map((stat, i) => (
                <div key={i} className={`card ${stat.bgClass} border ${stat.borderClass} p-5 transition-all`}>
                  <div className={`text-3xl md:text-4xl font-bold ${stat.textClass}`}>{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium text-[#4d4c5c] mt-2">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Informations parcours */}
            <div className="card p-6 md:p-8  transition-all">
              <h3 className="font-bold text-[#121117] text-lg mb-5">Informations</h3>
              <div className="grid sm:grid-cols-2 gap-5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f4f4f8] flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-[#121117]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <span className="text-[#6a697c] text-xs">Universite</span>
                    <p className="font-semibold text-[#121117]">UGANC</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <span className="text-[#6a697c] text-xs">Filiere</span>
                    <p className="font-semibold text-[#121117]">Informatique</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <span className="text-[#6a697c] text-xs">Annee</span>
                    <p className="font-semibold text-[#121117]">1ere annee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <span className="text-[#6a697c] text-xs">Statut</span>
                    <p className="font-semibold text-emerald-600">Actif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochains objectifs */}
            <div className="card p-6 md:p-8  transition-all">
              <h3 className="font-bold text-[#121117] text-lg mb-5">Prochains objectifs</h3>
              <div className="space-y-3">
                {objectifs.filter((o) => o.statut === "en_cours").slice(0, 3).map((obj) => (
                  <div key={obj.id} className="flex items-start gap-4 p-4 bg-[#f4f4f8] rounded-lg border border-[#dcdce5] hover:border-[#121117]/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs flex-shrink-0">
                      {obj.semestre}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#121117] text-sm">{obj.titre}</p>
                      <p className="text-xs text-[#4d4c5c] mt-1">{obj.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {activeTab === "notes" && (
          <div className="card overflow-hidden  transition-all">
            <div className="p-6 md:p-8 border-b border-[#dcdce5]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#121117] text-lg">Mes notes</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#4d4c5c]">Moyenne :</span>
                  <span className="text-lg font-bold text-[#121117]">{moyenne}</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f4f4f8]">
                  <tr>
                    <th className="text-left px-6 md:px-8 py-4 font-semibold text-[#4d4c5c] text-xs uppercase tracking-wider">Matiere</th>
                    <th className="text-center px-4 py-4 font-semibold text-[#4d4c5c] text-xs uppercase tracking-wider">Note</th>
                    <th className="text-center px-4 py-4 font-semibold text-[#4d4c5c] text-xs uppercase tracking-wider">Coef.</th>
                    <th className="text-center px-4 py-4 font-semibold text-[#4d4c5c] text-xs uppercase tracking-wider">Semestre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f8]">
                  {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-white transition-colors">
                      <td className="px-6 md:px-8 py-4 font-medium text-[#121117]">{note.matiere}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm ${
                          note.note >= 12
                            ? "bg-emerald-50 text-emerald-600"
                            : note.note >= 10
                            ? "bg-amber-50 text-amber-600"
                            : "bg-[#f4f4f8] text-red-600"
                        }`}>
                          {note.note}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-[#4d4c5c]">{note.coefficient}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-medium">{note.semestre}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Objectifs */}
        {activeTab === "objectifs" && (
          <div className="space-y-4">
            {objectifs.map((obj) => (
              <div key={obj.id} className="card p-5 md:p-7  transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="px-3 py-1 bg-[#f4f4f8] text-[#121117] rounded-full text-xs font-semibold">
                        {obj.semestre}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          obj.statut === "termine"
                            ? "bg-emerald-50 text-emerald-600"
                            : obj.statut === "en_cours"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-[#f4f4f8] text-[#6a697c]"
                        }`}
                      >
                        {obj.statut === "termine" ? "Termine" : obj.statut === "en_cours" ? "En cours" : "Abandonne"}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#121117] text-base mb-1.5">{obj.titre}</h4>
                    <p className="text-sm text-[#4d4c5c] leading-relaxed">{obj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-6 text-sm">
          <Link href="/profil" className="text-[#6a697c] hover:text-[#121117] font-medium transition-colors">
            ← Retour au profil
          </Link>
          <Link href="/stages" className="text-[#121117] hover:text-[#4d4c5c] font-medium transition-colors">
            Voir les offres de stage →
          </Link>
        </div>
    </PageShell>
  );
}
