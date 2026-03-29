"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import type { CvProfile } from "@/types";

function emptyCvProfile(): CvProfile {
  return {
    phone: "",
    location: "",
    headline: "",
    about: "",
    skills: [],
    languages: [],
    education: [],
    experiences: [],
    projects: [],
  };
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, isLoaded, updateUser } = useAuth();
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({
    field: "",
    university: "",
    year: "",
    description: "",
    meetLink: "",
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400 text-lg font-medium">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/inscription");
    return null;
  }

  const initialCv = useMemo(() => user.cvProfile ?? emptyCvProfile(), [user]);
  const [cvForm, setCvForm] = useState<CvProfile>(initialCv);
  const [cvSaved, setCvSaved] = useState(false);

  const handleBecomeAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      isAdvisor: true,
      advisorProfile: {
        ...advisorForm,
        availableSlots: ["Lundi 14h-16h", "Mercredi 10h-12h", "Vendredi 15h-17h"],
      },
    });
    setShowAdvisorForm(false);
    setAdvisorForm({ field: "", university: "", year: "", description: "", meetLink: "" });
  };

  const handleStopAdvisor = () => {
    updateUser({ isAdvisor: false, advisorProfile: undefined });
  };

  const saveCv = () => {
    updateUser({ cvProfile: cvForm });
    setCvSaved(true);
    setTimeout(() => setCvSaved(false), 1500);
  };

  const updateEducation = (
    idx: number,
    updates: Partial<NonNullable<CvProfile["education"]>[number]>
  ) => {
    setCvForm((p) => ({
      ...p,
      education: p.education.map((e, i) => (i === idx ? { ...e, ...updates } : e)),
    }));
  };

  const addEducation = () => {
    setCvForm((p) => ({
      ...p,
      education: [
        ...p.education,
        { degree: "", school: "", startYear: "", endYear: "", details: "" },
      ],
    }));
  };

  const removeEducation = (idx: number) => {
    setCvForm((p) => ({
      ...p,
      education: p.education.filter((_, i) => i !== idx),
    }));
  };

  const updateExperience = (
    idx: number,
    updates: Partial<NonNullable<CvProfile["experiences"]>[number]>
  ) => {
    setCvForm((p) => ({
      ...p,
      experiences: p.experiences.map((e, i) =>
        i === idx ? { ...e, ...updates } : e
      ),
    }));
  };

  const addExperience = () => {
    setCvForm((p) => ({
      ...p,
      experiences: [
        ...p.experiences,
        {
          title: "",
          company: "",
          location: "",
          start: "",
          end: "",
          bullets: [""],
        },
      ],
    }));
  };

  const removeExperience = (idx: number) => {
    setCvForm((p) => ({
      ...p,
      experiences: p.experiences.filter((_, i) => i !== idx),
    }));
  };

  const updateExperienceBullet = (expIdx: number, bulletIdx: number, text: string) => {
    setCvForm((p) => ({
      ...p,
      experiences: p.experiences.map((exp, i) => {
        if (i !== expIdx) return exp;
        const bullets = [...exp.bullets];
        bullets[bulletIdx] = text;
        return { ...exp, bullets };
      }),
    }));
  };

  const addExperienceBullet = (expIdx: number) => {
    setCvForm((p) => ({
      ...p,
      experiences: p.experiences.map((exp, i) =>
        i === expIdx ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    }));
  };

  const removeExperienceBullet = (expIdx: number, bulletIdx: number) => {
    setCvForm((p) => ({
      ...p,
      experiences: p.experiences.map((exp, i) => {
        if (i !== expIdx) return exp;
        const bullets = exp.bullets.filter((_, bi) => bi !== bulletIdx);
        return { ...exp, bullets: bullets.length ? bullets : [""] };
      }),
    }));
  };

  const updateProject = (
    idx: number,
    updates: Partial<NonNullable<CvProfile["projects"]>[number]>
  ) => {
    setCvForm((p) => ({
      ...p,
      projects: p.projects.map((pr, i) => (i === idx ? { ...pr, ...updates } : pr)),
    }));
  };

  const addProject = () => {
    setCvForm((p) => ({
      ...p,
      projects: [
        ...p.projects,
        { name: "", description: "", link: "", bullets: [""] },
      ],
    }));
  };

  const removeProject = (idx: number) => {
    setCvForm((p) => ({
      ...p,
      projects: p.projects.filter((_, i) => i !== idx),
    }));
  };

  const updateProjectBullet = (projIdx: number, bulletIdx: number, text: string) => {
    setCvForm((p) => ({
      ...p,
      projects: p.projects.map((pr, i) => {
        if (i !== projIdx) return pr;
        const bullets = [...pr.bullets];
        bullets[bulletIdx] = text;
        return { ...pr, bullets };
      }),
    }));
  };

  const addProjectBullet = (projIdx: number) => {
    setCvForm((p) => ({
      ...p,
      projects: p.projects.map((pr, i) =>
        i === projIdx ? { ...pr, bullets: [...pr.bullets, ""] } : pr
      ),
    }));
  };

  const removeProjectBullet = (projIdx: number, bulletIdx: number) => {
    setCvForm((p) => ({
      ...p,
      projects: p.projects.map((pr, i) => {
        if (i !== projIdx) return pr;
        const bullets = pr.bullets.filter((_, bi) => bi !== bulletIdx);
        return { ...pr, bullets: bullets.length ? bullets : [""] };
      }),
    }));
  };

  const setSkillsFromText = (text: string) => {
    setCvForm((p) => ({
      ...p,
      skills: text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const setLanguagesFromText = (text: string) => {
    setCvForm((p) => ({
      ...p,
      languages: text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all";
  const inputSmClass =
    "w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none text-sm transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      <div className="max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">Mon profil</h1>

        {/* Profile Card */}
        <div className="card bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 mb-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-18 h-18 min-w-[4.5rem] min-h-[4.5rem] rounded-2xl bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-2xl text-white font-bold shadow-lg shadow-red-200/50">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 mt-0.5">{user.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                  user.role === "bachelier"
                    ? "bg-red-50 text-[#9e1830]"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {user.role === "bachelier" ? "Nouveau bachelier" : "Etudiant"}
              </span>
            </div>
          </div>

          {user.role === "etudiant" && (
            <div className="border-t border-slate-100 pt-7">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">Statut conseiller</h3>
              {user.isAdvisor && user.advisorProfile ? (
                <div className="bg-emerald-50/80 rounded-2xl p-5 mb-4 border border-emerald-100">
                  <p className="text-emerald-700 font-semibold mb-2">Conseiller actif</p>
                  <p className="text-sm text-slate-700">
                    <strong>{user.advisorProfile.field}</strong> • {user.advisorProfile.university} • {user.advisorProfile.year}
                  </p>
                  {user.advisorProfile.description && (
                    <p className="text-sm text-slate-500 mt-2 italic">&quot;{user.advisorProfile.description}&quot;</p>
                  )}
                  <button
                    onClick={handleStopAdvisor}
                    className="mt-4 text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
                  >
                    Ne plus etre conseiller
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                    En tant qu&apos;etudiant, tu peux aider les bacheliers en devenant conseiller.
                    Tu pourras discuter avec eux et prendre des rendez-vous pour des appels Meet.
                  </p>
                  <button
                    onClick={() => setShowAdvisorForm(true)}
                    className="btn-primary px-5 py-2.5 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white rounded-xl font-semibold hover:from-[#9e1830] hover:to-[#9e1830] transition-all shadow-sm shadow-red-200/50"
                  >
                    Devenir conseiller
                  </button>
                </>
              )}
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 mt-7">
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
            >
              Se deconnecter
            </button>
          </div>
        </div>

        {/* Section CV */}
        <div className="card bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mon CV</h3>
              <p className="text-sm text-slate-500 mt-1">
                Renseigne tes infos, puis genere automatiquement ton CV.
              </p>
            </div>
            <Link
              href="/cv"
              className="btn-primary px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c41e3a] to-[#008751] text-white font-semibold hover:from-[#9e1830] hover:to-[#008751] transition-all shadow-sm shadow-red-200/50 whitespace-nowrap"
            >
              Generer (OpenAI)
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Telephone
              </label>
              <input
                value={cvForm.phone || ""}
                onChange={(e) =>
                  setCvForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+224 ..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Localisation
              </label>
              <input
                value={cvForm.location || ""}
                onChange={(e) =>
                  setCvForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="Conakry, Guinee"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Titre (headline)
            </label>
            <input
              value={cvForm.headline || ""}
              onChange={(e) =>
                setCvForm((p) => ({ ...p, headline: e.target.value }))
              }
              placeholder="Ex: Etudiant en Informatique | Developpeur junior"
              className={inputClass}
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              A propos
            </label>
            <textarea
              value={cvForm.about || ""}
              onChange={(e) => setCvForm((p) => ({ ...p, about: e.target.value }))}
              rows={4}
              placeholder="Une courte presentation (objectif, interets, ce que tu recherches...)"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Competences (separees par des virgules)
              </label>
              <input
                defaultValue={(cvForm.skills || []).join(", ")}
                onChange={(e) => setSkillsFromText(e.target.value)}
                placeholder="Ex: Excel, Communication, JavaScript, ..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Langues (separees par des virgules)
              </label>
              <input
                defaultValue={(cvForm.languages || []).join(", ")}
                onChange={(e) => setLanguagesFromText(e.target.value)}
                placeholder="Ex: Francais (courant), Anglais (intermediaire)"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <button
              type="button"
              onClick={saveCv}
              className="btn-primary px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white font-semibold hover:from-[#9e1830] hover:to-[#9e1830] transition-all shadow-sm shadow-red-200/50"
            >
              Enregistrer mes infos CV
            </button>
            {cvSaved && (
              <span className="text-sm text-emerald-600 font-semibold">
                Enregistre
              </span>
            )}
            <span className="text-xs text-slate-400">
              (Ajoute aussi formation, experiences et projets ci-dessous.)
            </span>
          </div>

          {/* Formation */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Formation</h4>
              <button
                type="button"
                onClick={addEducation}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#c41e3a] hover:bg-red-50 hover:border-red-200 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.education.map((ed, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/30 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Diplome / Formation
                        </label>
                        <input
                          value={ed.degree}
                          onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                          placeholder="Licence, BTS, etc."
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Etablissement
                        </label>
                        <input
                          value={ed.school}
                          onChange={(e) => updateEducation(idx, { school: e.target.value })}
                          placeholder="UGANC, Gamal, ..."
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Debut (annee)
                        </label>
                        <input
                          value={ed.startYear || ""}
                          onChange={(e) => updateEducation(idx, { startYear: e.target.value })}
                          placeholder="2023"
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Fin (annee)
                        </label>
                        <input
                          value={ed.endYear || ""}
                          onChange={(e) => updateEducation(idx, { endYear: e.target.value })}
                          placeholder="2026"
                          className={inputSmClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      Details (optionnel)
                    </label>
                    <input
                      value={ed.details || ""}
                      onChange={(e) => updateEducation(idx, { details: e.target.value })}
                      placeholder="Mention, modules, activites, ..."
                      className={inputSmClass}
                    />
                  </div>
                </div>
              ))}

              {cvForm.education.length === 0 && (
                <p className="text-sm text-slate-400 py-2">
                  Ajoute ta formation (lycee, universite, certificats...).
                </p>
              )}
            </div>
          </div>

          {/* Experiences */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Experiences</h4>
              <button
                type="button"
                onClick={addExperience}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#c41e3a] hover:bg-red-50 hover:border-red-200 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/30 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Poste / Role
                        </label>
                        <input
                          value={exp.title}
                          onChange={(e) => updateExperience(idx, { title: e.target.value })}
                          placeholder="Stagiaire, Benevole..."
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Organisation / Entreprise
                        </label>
                        <input
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, { company: e.target.value })}
                          placeholder="Entreprise, ONG, ..."
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Debut (YYYY-MM)
                        </label>
                        <input
                          value={exp.start || ""}
                          onChange={(e) => updateExperience(idx, { start: e.target.value })}
                          placeholder="2025-06"
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Fin (YYYY-MM ou Present)
                        </label>
                        <input
                          value={exp.end || ""}
                          onChange={(e) => updateExperience(idx, { end: e.target.value })}
                          placeholder="2025-09"
                          className={inputSmClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Lieu (optionnel)
                        </label>
                        <input
                          value={exp.location || ""}
                          onChange={(e) => updateExperience(idx, { location: e.target.value })}
                          placeholder="Conakry, Guinee"
                          className={inputSmClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-slate-500">
                        Realisations (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(idx)}
                        className="text-xs font-semibold text-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                      >
                        + Ajouter une puce
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {exp.bullets.map((b, bi) => (
                        <div key={bi} className="flex gap-2 items-center">
                          <input
                            value={b}
                            onChange={(e) =>
                              updateExperienceBullet(idx, bi, e.target.value)
                            }
                            placeholder="Ex: Realise une application..., Ameliore..."
                            className={`flex-1 ${inputSmClass}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(idx, bi)}
                            className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {cvForm.experiences.length === 0 && (
                <p className="text-sm text-slate-400 py-2">
                  Ajoute tes stages, benevolat, projets en equipe, jobs etudiants...
                </p>
              )}
            </div>
          </div>

          {/* Projets */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Projets</h4>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#c41e3a] hover:bg-red-50 hover:border-red-200 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.projects.map((pr, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/30 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Nom du projet
                        </label>
                        <input
                          value={pr.name}
                          onChange={(e) => updateProject(idx, { name: e.target.value })}
                          placeholder="O'Kampus, Portfolio, ..."
                          className={inputSmClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Lien (optionnel)
                        </label>
                        <input
                          value={pr.link || ""}
                          onChange={(e) => updateProject(idx, { link: e.target.value })}
                          placeholder="https://github.com/..."
                          className={inputSmClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          Description (optionnel)
                        </label>
                        <input
                          value={pr.description || ""}
                          onChange={(e) =>
                            updateProject(idx, { description: e.target.value })
                          }
                          placeholder="En une phrase : objectif du projet"
                          className={inputSmClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-slate-500">
                        Points cles (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(idx)}
                        className="text-xs font-semibold text-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                      >
                        + Ajouter une puce
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {pr.bullets.map((b, bi) => (
                        <div key={bi} className="flex gap-2 items-center">
                          <input
                            value={b}
                            onChange={(e) => updateProjectBullet(idx, bi, e.target.value)}
                            placeholder="Ex: Tech utilisee, resultats, role..."
                            className={`flex-1 ${inputSmClass}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(idx, bi)}
                            className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {cvForm.projects.length === 0 && (
                <p className="text-sm text-slate-400 py-2">
                  Ajoute tes projets (personnels, scolaires, associatifs...).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4">
          <Link
            href="/assistant"
            className="flex-1 p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 hover:shadow-md hover:shadow-red-100/50 transition-all text-center group"
          >
            <span className="text-2xl block mb-2">IA</span>
            <span className="font-semibold text-slate-700 group-hover:text-[#c41e3a] transition-colors">Assistant IA</span>
          </Link>
          <Link
            href="/conseil"
            className="flex-1 p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 hover:shadow-md hover:shadow-red-100/50 transition-all text-center group"
          >
            <span className="text-2xl block mb-2">C</span>
            <span className="font-semibold text-slate-700 group-hover:text-[#c41e3a] transition-colors">Conseillers</span>
          </Link>
          <Link
            href="/forum"
            className="flex-1 p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all text-center group"
          >
            <span className="text-2xl block mb-2">F</span>
            <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">Forum</span>
          </Link>
        </div>
      </div>

      {/* Modal Devenir conseiller */}
      {showAdvisorForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Devenir conseiller</h3>
            <form onSubmit={handleBecomeAdvisor} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Filiere</label>
                <input
                  type="text"
                  value={advisorForm.field}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, field: e.target.value })}
                  placeholder="Ex: Medecine, Droit, Informatique"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Universite</label>
                <input
                  type="text"
                  value={advisorForm.university}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, university: e.target.value })}
                  placeholder="Ex: UGANC, Gamal"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Annee</label>
                <input
                  type="text"
                  value={advisorForm.year}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, year: e.target.value })}
                  placeholder="Ex: 4eme annee"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Petite description de toi (visible par les bacheliers)
                </label>
                <textarea
                  value={advisorForm.description}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, description: e.target.value })}
                  placeholder="Ex: Passionne par la medecine, j'aime partager mon experience avec les futurs etudiants..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Lien Meet pour les rendez-vous (optionnel)
                </label>
                <input
                  type="url"
                  value={advisorForm.meetLink}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvisorForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white font-semibold hover:from-[#9e1830] hover:to-[#9e1830] transition-all shadow-sm shadow-red-200/50"
                >
                  Devenir conseiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
