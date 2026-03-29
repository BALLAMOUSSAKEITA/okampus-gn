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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#008751] flex items-center justify-center text-2xl text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "bachelier"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {user.role === "bachelier" ? "Nouveau bachelier" : "Étudiant"}
              </span>
            </div>
          </div>

          {user.role === "etudiant" && (
            <div className="border-t border-amber-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Statut conseiller</h3>
              {user.isAdvisor && user.advisorProfile ? (
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-emerald-800 font-medium mb-2">✓ Tu es conseiller</p>
                  <p className="text-sm text-gray-700">
                    <strong>{user.advisorProfile.field}</strong> • {user.advisorProfile.university} • {user.advisorProfile.year}
                  </p>
                  {user.advisorProfile.description && (
                    <p className="text-sm text-gray-600 mt-2 italic">&quot;{user.advisorProfile.description}&quot;</p>
                  )}
                  <button
                    onClick={handleStopAdvisor}
                    className="mt-3 text-sm text-red-600 hover:underline"
                  >
                    Ne plus être conseiller
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4">
                    En tant qu&apos;étudiant, tu peux aider les bacheliers en devenant conseiller. 
                    Tu pourras discuter avec eux et prendre des rendez-vous pour des appels Meet.
                  </p>
                  <button
                    onClick={() => setShowAdvisorForm(true)}
                    className="px-4 py-2 bg-[#008751] text-white rounded-xl font-medium hover:bg-[#00a86b] transition-colors"
                  >
                    Devenir conseiller
                  </button>
                </>
              )}
            </div>
          )}

          <div className="border-t border-amber-100 pt-6 mt-6">
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              className="text-red-600 hover:underline text-sm"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Section CV */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Mon CV</h3>
              <p className="text-sm text-gray-600">
                Renseigne tes infos, puis génère automatiquement ton CV.
              </p>
            </div>
            <Link
              href="/cv"
              className="px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700"
            >
              Générer (OpenAI)
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                value={cvForm.phone || ""}
                onChange={(e) =>
                  setCvForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+224 ..."
                className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                value={cvForm.location || ""}
                onChange={(e) =>
                  setCvForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="Conakry, Guinée"
                className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre (headline)
            </label>
            <input
              value={cvForm.headline || ""}
              onChange={(e) =>
                setCvForm((p) => ({ ...p, headline: e.target.value }))
              }
              placeholder="Ex: Étudiant en Informatique | Développeur junior"
              className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              À propos
            </label>
            <textarea
              value={cvForm.about || ""}
              onChange={(e) => setCvForm((p) => ({ ...p, about: e.target.value }))}
              rows={4}
              placeholder="Une courte présentation (objectif, intérêts, ce que tu recherches...)"
              className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compétences (séparées par des virgules)
              </label>
              <input
                defaultValue={(cvForm.skills || []).join(", ")}
                onChange={(e) => setSkillsFromText(e.target.value)}
                placeholder="Ex: Excel, Communication, JavaScript, ..."
                className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langues (séparées par des virgules)
              </label>
              <input
                defaultValue={(cvForm.languages || []).join(", ")}
                onChange={(e) => setLanguagesFromText(e.target.value)}
                placeholder="Ex: Français (courant), Anglais (intermédiaire)"
                className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-violet-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={saveCv}
              className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-gray-900 font-medium hover:bg-amber-100"
            >
              Enregistrer mes infos CV
            </button>
            {cvSaved && (
              <span className="text-sm text-emerald-700 font-medium">
                ✓ Enregistré
              </span>
            )}
            <span className="text-xs text-gray-500">
              (Ajoute aussi formation, expériences et projets ci-dessous.)
            </span>
          </div>

          {/* Formation */}
          <div className="mt-8 border-t border-amber-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-gray-900">Formation</h4>
              <button
                type="button"
                onClick={addEducation}
                className="px-3 py-1.5 rounded-lg border border-amber-200 text-sm font-medium hover:bg-amber-50"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {cvForm.education.map((ed, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-100 p-4 bg-amber-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Diplôme / Formation
                        </label>
                        <input
                          value={ed.degree}
                          onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                          placeholder="Licence, BTS, etc."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Établissement
                        </label>
                        <input
                          value={ed.school}
                          onChange={(e) => updateEducation(idx, { school: e.target.value })}
                          placeholder="UGANC, Gamal, ..."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Début (année)
                        </label>
                        <input
                          value={ed.startYear || ""}
                          onChange={(e) => updateEducation(idx, { startYear: e.target.value })}
                          placeholder="2023"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fin (année)
                        </label>
                        <input
                          value={ed.endYear || ""}
                          onChange={(e) => updateEducation(idx, { endYear: e.target.value })}
                          placeholder="2026"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Détails (optionnel)
                    </label>
                    <input
                      value={ed.details || ""}
                      onChange={(e) => updateEducation(idx, { details: e.target.value })}
                      placeholder="Mention, modules, activités, ..."
                      className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                    />
                  </div>
                </div>
              ))}

              {cvForm.education.length === 0 && (
                <p className="text-sm text-gray-500">
                  Ajoute ta formation (lycée, université, certificats…).
                </p>
              )}
            </div>
          </div>

          {/* Expériences */}
          <div className="mt-8 border-t border-amber-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-gray-900">Expériences</h4>
              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-1.5 rounded-lg border border-amber-200 text-sm font-medium hover:bg-amber-50"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {cvForm.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-100 p-4 bg-amber-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Poste / Rôle
                        </label>
                        <input
                          value={exp.title}
                          onChange={(e) => updateExperience(idx, { title: e.target.value })}
                          placeholder="Stagiaire, Bénévole..."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Organisation / Entreprise
                        </label>
                        <input
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, { company: e.target.value })}
                          placeholder="Entreprise, ONG, ..."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Début (YYYY-MM)
                        </label>
                        <input
                          value={exp.start || ""}
                          onChange={(e) => updateExperience(idx, { start: e.target.value })}
                          placeholder="2025-06"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fin (YYYY-MM ou Présent)
                        </label>
                        <input
                          value={exp.end || ""}
                          onChange={(e) => updateExperience(idx, { end: e.target.value })}
                          placeholder="2025-09"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Lieu (optionnel)
                        </label>
                        <input
                          value={exp.location || ""}
                          onChange={(e) => updateExperience(idx, { location: e.target.value })}
                          placeholder="Conakry, Guinée"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-gray-600">
                        Réalisations (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(idx)}
                        className="text-xs font-medium text-[#008751] hover:underline"
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
                            placeholder="Ex: Réalisé une application..., Amélioré..."
                            className="flex-1 px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(idx, bi)}
                            className="text-xs text-red-600 hover:underline"
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
                <p className="text-sm text-gray-500">
                  Ajoute tes stages, bénévolat, projets en équipe, jobs étudiants…
                </p>
              )}
            </div>
          </div>

          {/* Projets */}
          <div className="mt-8 border-t border-amber-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-gray-900">Projets</h4>
              <button
                type="button"
                onClick={addProject}
                className="px-3 py-1.5 rounded-lg border border-amber-200 text-sm font-medium hover:bg-amber-50"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {cvForm.projects.map((pr, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-100 p-4 bg-amber-50/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Nom du projet
                        </label>
                        <input
                          value={pr.name}
                          onChange={(e) => updateProject(idx, { name: e.target.value })}
                          placeholder="O'Kampus, Portfolio, ..."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Lien (optionnel)
                        </label>
                        <input
                          value={pr.link || ""}
                          onChange={(e) => updateProject(idx, { link: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description (optionnel)
                        </label>
                        <input
                          value={pr.description || ""}
                          onChange={(e) =>
                            updateProject(idx, { description: e.target.value })
                          }
                          placeholder="En une phrase : objectif du projet"
                          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-gray-600">
                        Points clés (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(idx)}
                        className="text-xs font-medium text-[#008751] hover:underline"
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
                            placeholder="Ex: Tech utilisée, résultats, rôle..."
                            className="flex-1 px-3 py-2 rounded-lg border border-amber-200 focus:border-violet-400 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(idx, bi)}
                            className="text-xs text-red-600 hover:underline"
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
                <p className="text-sm text-gray-500">
                  Ajoute tes projets (personnels, scolaires, associatifs…).
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/assistant"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-violet-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">🤖</span>
            <span className="font-medium">Assistant IA</span>
          </Link>
          <Link
            href="/conseil"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">💬</span>
            <span className="font-medium">Conseillers</span>
          </Link>
          <Link
            href="/forum"
            className="flex-1 p-4 bg-white rounded-xl border border-amber-100 hover:border-emerald-200 hover:shadow-md transition-all text-center"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="font-medium">Forum</span>
          </Link>
        </div>
      </div>

      {/* Modal Devenir conseiller */}
      {showAdvisorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Devenir conseiller</h3>
            <form onSubmit={handleBecomeAdvisor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                <input
                  type="text"
                  value={advisorForm.field}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, field: e.target.value })}
                  placeholder="Ex: Médecine, Droit, Informatique"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Université</label>
                <input
                  type="text"
                  value={advisorForm.university}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, university: e.target.value })}
                  placeholder="Ex: UGANC, Gamal"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <input
                  type="text"
                  value={advisorForm.year}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, year: e.target.value })}
                  placeholder="Ex: 4ème année"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Petite description de toi (visible par les bacheliers)
                </label>
                <textarea
                  value={advisorForm.description}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, description: e.target.value })}
                  placeholder="Ex: Passionné par la médecine, j'aime partager mon expérience avec les futurs étudiants..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien Meet pour les rendez-vous (optionnel)
                </label>
                <input
                  type="url"
                  value={advisorForm.meetLink}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#008751] outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvisorForm(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-[#008751] text-white font-semibold hover:bg-[#00a86b]"
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
