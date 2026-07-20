"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import type { CvProfile } from "@/types";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import UserAvatar from "@/components/UserAvatar";

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
  const [cvForm, setCvForm] = useState<CvProfile>(emptyCvProfile);
  const [cvSaved, setCvSaved] = useState(false);

  useEffect(() => {
    if (user?.cvProfile) {
      setCvForm(user.cvProfile);
    } else if (user) {
      setCvForm(emptyCvProfile());
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8]">
        <div className="animate-pulse text-[#6a697c] text-lg font-medium">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/inscription");
    return null;
  }

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
    "w-full px-4 py-2.5 rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all";
  const inputSmClass =
    "w-full px-3 py-2 rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none text-sm transition-all";

  return (
    <>
    <PageShell narrow>
      <PageHeader
        title="Mon profil"
        description="Gere ton compte, ton statut conseiller et les infos de ton CV"
      />

        {/* Profile Card */}
        <div className="card border border-[#dcdce5] p-8 mb-8">
          <div className="flex items-center gap-5 mb-8">
            <UserAvatar name={user.name} size={72} rounded="lg" />
            <div>
              <h2 className="text-xl font-bold text-[#121117]">{user.name}</h2>
              <p className="text-[#4d4c5c] mt-0.5">{user.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                  user.role === "bachelier"
                    ? "bg-[#f4f4f8] text-[#4d4c5c]"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {user.role === "bachelier" ? "Nouveau bachelier" : "Etudiant"}
              </span>
            </div>
          </div>

          {user.role === "etudiant" && (
            <div className="border-t border-[#dcdce5] pt-7">
              <h3 className="font-semibold text-[#121117] mb-4 text-sm uppercase tracking-wide">Statut conseiller</h3>
              {user.isAdvisor && user.advisorProfile ? (
                <div className="bg-emerald-50/80 rounded-lg p-5 mb-4 border border-emerald-100">
                  <p className="text-emerald-700 font-semibold mb-2">Conseiller actif</p>
                  <p className="text-sm text-[#4d4c5c]">
                    <strong>{user.advisorProfile.field}</strong> • {user.advisorProfile.university} • {user.advisorProfile.year}
                  </p>
                  {user.advisorProfile.description && (
                    <p className="text-sm text-[#4d4c5c] mt-2 italic">&quot;{user.advisorProfile.description}&quot;</p>
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
                  <p className="text-[#4d4c5c] text-sm mb-5 leading-relaxed">
                    En tant qu&apos;etudiant, tu peux aider les bacheliers en devenant conseiller.
                    Tu pourras discuter avec eux et prendre des rendez-vous pour des appels Meet.
                  </p>
                  <button
                    onClick={() => setShowAdvisorForm(true)}
                    className="btn-primary"
                  >
                    Devenir conseiller
                  </button>
                </>
              )}
            </div>
          )}

          <div className="border-t border-[#dcdce5] pt-6 mt-7">
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              className="text-[#6a697c] hover:text-red-500 text-sm font-medium transition-colors"
            >
              Se deconnecter
            </button>
          </div>
        </div>

        {/* Section CV */}
        <div className="card border border-[#dcdce5] p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#121117]">Mon CV</h3>
              <p className="text-sm text-[#4d4c5c] mt-1">
                Renseigne tes infos, puis genere automatiquement ton CV.
              </p>
            </div>
            <Link
              href="/cv"
              className="btn-primary"
            >
              Generer (OpenAI)
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div>
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                Localisation
              </label>
              <input
                value={cvForm.location || ""}
                onChange={(e) =>
                  setCvForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="Conakry"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
            <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
              <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
              className="btn-primary"
            >
              Enregistrer mes infos CV
            </button>
            {cvSaved && (
              <span className="text-sm text-emerald-600 font-semibold">
                Enregistre
              </span>
            )}
            <span className="text-xs text-[#6a697c]">
              (Ajoute aussi formation, experiences et projets ci-dessous.)
            </span>
          </div>

          {/* Formation */}
          <div className="mt-10 border-t border-[#dcdce5] pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-[#121117] text-sm uppercase tracking-wide">Formation</h4>
              <button
                type="button"
                onClick={addEducation}
                className="px-4 py-2 rounded-lg border border-[#dcdce5] text-sm font-medium text-[#121117] hover:bg-[#f4f4f8] hover:border-[#121117]/30 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.education.map((ed, idx) => (
                <div
                  key={idx}
                  className="card p-5 bg-white hover:border-[#dcdce5] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                      className="text-xs text-[#6a697c] hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                <p className="text-sm text-[#6a697c] py-2">
                  Ajoute ta formation (lycee, universite, certificats...).
                </p>
              )}
            </div>
          </div>

          {/* Experiences */}
          <div className="mt-10 border-t border-[#dcdce5] pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-[#121117] text-sm uppercase tracking-wide">Experiences</h4>
              <button
                type="button"
                onClick={addExperience}
                className="px-4 py-2 rounded-lg border border-[#dcdce5] text-sm font-medium text-[#121117] hover:bg-[#f4f4f8] hover:border-[#121117]/30 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="card p-5 bg-white hover:border-[#dcdce5] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
                          Lieu (optionnel)
                        </label>
                        <input
                          value={exp.location || ""}
                          onChange={(e) => updateExperience(idx, { location: e.target.value })}
                          placeholder="Conakry"
                          className={inputSmClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-xs text-[#6a697c] hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-[#4d4c5c]">
                        Realisations (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(idx)}
                        className="text-xs font-semibold text-[#121117] hover:text-[#121117] transition-colors"
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
                            className="text-xs text-[#6a697c] hover:text-red-500 font-medium transition-colors"
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
                <p className="text-sm text-[#6a697c] py-2">
                  Ajoute tes stages, benevolat, projets en equipe, jobs etudiants...
                </p>
              )}
            </div>
          </div>

          {/* Projets */}
          <div className="mt-10 border-t border-[#dcdce5] pt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-[#121117] text-sm uppercase tracking-wide">Projets</h4>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 rounded-lg border border-[#dcdce5] text-sm font-medium text-[#121117] hover:bg-[#f4f4f8] hover:border-[#121117]/30 transition-all"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {cvForm.projects.map((pr, idx) => (
                <div
                  key={idx}
                  className="card p-5 bg-white hover:border-[#dcdce5] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                        <label className="block text-xs font-medium text-[#4d4c5c] mb-1.5">
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
                      className="text-xs text-[#6a697c] hover:text-red-500 font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-medium text-[#4d4c5c]">
                        Points cles (puces)
                      </label>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(idx)}
                        className="text-xs font-semibold text-[#121117] hover:text-[#121117] transition-colors"
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
                            className="text-xs text-[#6a697c] hover:text-red-500 font-medium transition-colors"
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
                <p className="text-sm text-[#6a697c] py-2">
                  Ajoute tes projets (personnels, scolaires, associatifs...).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <Link
            href="/assistant"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">IA</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-[#121117] transition-colors">Assistant IA</span>
          </Link>
          <Link
            href="/conseil"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">C</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-[#121117] transition-colors">Conseillers</span>
          </Link>
          <Link
            href="/forum"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">F</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-emerald-600 transition-colors">Forum</span>
          </Link>
        </div>
    </PageShell>

      {/* Modal Devenir conseiller */}
      {showAdvisorForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-lg shadow-2xl shadow-[#121117]/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="h-1 bg-[#121117] rounded-t-2xl md:rounded-t-lg" />
            <div className="p-6 md:p-8 border-b border-[#dcdce5]">
              <h3 className="text-xl font-bold text-[#121117]">Devenir conseiller</h3>
            </div>
            <form onSubmit={handleBecomeAdvisor} className="p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">Filiere</label>
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
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">Universite</label>
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
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">Annee</label>
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
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
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
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Devenir conseiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
