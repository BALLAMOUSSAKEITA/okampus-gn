"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { CvProfile } from "@/types";

function defaultCv(): CvProfile {
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

export default function CvPage() {
  const router = useRouter();
  const { user, isLoaded, updateUser } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");

  const cvProfile = useMemo(() => user?.cvProfile ?? defaultCv(), [user]);

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

  const generate = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedMarkdown("");
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          roleLabel: user.role === "etudiant" ? "Etudiant" : "Nouveau bachelier",
          cvProfile,
        }),
      });
      const data = (await res.json()) as { markdown?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Erreur lors de la generation");
      setGeneratedMarkdown(data.markdown || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMarkdownToProfile = () => {
    // optionnel : stocker la version generee dans le profil pour la retrouver
    updateUser({
      cvProfile: {
        ...cvProfile,
        // on garde le profil, la version markdown reste cote page pour l'instant
      },
    });
  };

  const renderList = (items: string[]) =>
    items.length ? (
      <ul className="list-disc list-inside text-sm text-slate-700 space-y-0.5">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-400 italic">Non renseigne</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Generateur de CV
            </h1>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Genere automatiquement ton CV a partir de ton profil, avec OpenAI.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profil"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 font-medium transition-all text-sm"
            >
              Retour profil
            </Link>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 font-medium transition-all text-sm"
              type="button"
            >
              Imprimer / PDF
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="card bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
          {/* Generate bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pb-8 border-b border-slate-100">
            <div className="text-sm text-slate-500">
              Modele OpenAI configure via <span className="font-mono text-[#c41e3a] bg-red-50 px-1.5 py-0.5 rounded-md text-xs">OPENAI_MODEL</span>{" "}
              dans <span className="font-mono text-[#c41e3a] bg-red-50 px-1.5 py-0.5 rounded-md text-xs">.env.local</span>.
            </div>
            <button
              onClick={generate}
              disabled={isGenerating}
              className="btn-primary px-6 py-3 rounded-xl bg-gradient-to-r from-[#c41e3a] to-[#008751] text-white font-semibold disabled:opacity-50 hover:from-[#9e1830] hover:to-[#008751] transition-all shadow-md shadow-red-200/50 whitespace-nowrap"
              type="button"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generation en cours...
                </span>
              ) : (
                "Generer mon CV"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Apercu style pour impression */}
          <div className="mt-8">
            <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-4">
              Apercu style (impression)
            </h2>
            <div className="rounded-2xl border border-slate-200 p-8 bg-white print:border-0 print:shadow-none print:p-0">
              {/* CV Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name}</h3>
                  <p className="text-sm text-[#c41e3a] font-medium mt-1">
                    {cvProfile.headline || "Titre / poste vise"}
                  </p>
                </div>
                <div className="text-sm text-slate-500 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {user.email}
                  </p>
                  {cvProfile.phone && (
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      {cvProfile.phone}
                    </p>
                  )}
                  {cvProfile.location && (
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      {cvProfile.location}
                    </p>
                  )}
                </div>
              </div>

              {/* About */}
              {cvProfile.about && (
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2">A propos</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {cvProfile.about}
                  </p>
                </div>
              )}

              {/* Skills & Languages */}
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2">Competences</h4>
                  {cvProfile.skills.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cvProfile.skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-50 text-[#9e1830] text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Non renseigne</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2">Langues</h4>
                  {cvProfile.languages.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cvProfile.languages.map((l, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Non renseigne</p>
                  )}
                </div>
              </div>

              {/* Formation */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-3">Formation</h4>
                {cvProfile.education.length ? (
                  <div className="space-y-3">
                    {cvProfile.education.map((ed, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-red-200">
                        <p className="font-semibold text-slate-800">
                          {ed.degree || "Diplome"} — {ed.school || "Etablissement"}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {ed.startYear || "Debut"} - {ed.endYear || "Fin"}
                        </p>
                        {ed.details && <p className="text-slate-600 mt-1">{ed.details}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Non renseigne</p>
                )}
              </div>

              {/* Experiences */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-3">Experiences</h4>
                {cvProfile.experiences.length ? (
                  <div className="space-y-4">
                    {cvProfile.experiences.map((exp, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-red-200">
                        <p className="font-semibold text-slate-800">
                          {exp.title || "Poste"} — {exp.company || "Organisation"}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {exp.start || "Debut"} - {exp.end || "Present"}
                          {exp.location ? ` • ${exp.location}` : ""}
                        </p>
                        <div className="mt-1.5">
                          {renderList(exp.bullets.filter(Boolean))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Non renseigne</p>
                )}
              </div>

              {/* Projets */}
              <div>
                <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-3">Projets</h4>
                {cvProfile.projects.length ? (
                  <div className="space-y-4">
                    {cvProfile.projects.map((pr, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-emerald-200">
                        <p className="font-semibold text-slate-800">
                          {pr.name || "Projet"}
                          {pr.link && (
                            <span className="text-[#c41e3a] font-normal ml-2 text-xs">({pr.link})</span>
                          )}
                        </p>
                        {pr.description && (
                          <p className="text-slate-600 mt-0.5">{pr.description}</p>
                        )}
                        <div className="mt-1.5">
                          {renderList(pr.bullets.filter(Boolean))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Non renseigne</p>
                )}
              </div>
            </div>
          </div>

          {/* Markdown output + Preview */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10 pt-8 border-t border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-4">
                Sortie (Markdown)
              </h2>
              <textarea
                value={generatedMarkdown}
                onChange={(e) => setGeneratedMarkdown(e.target.value)}
                placeholder="Le CV genere apparaitra ici..."
                className="w-full min-h-[420px] p-5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none font-mono text-sm transition-all"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedMarkdown);
                  }}
                  disabled={!generatedMarkdown}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-40 font-medium text-sm transition-all"
                >
                  Copier
                </button>
                <button
                  type="button"
                  onClick={saveMarkdownToProfile}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 font-medium text-sm transition-all"
                >
                  Sauvegarder (profil)
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Pour une exportation propre, utilise &quot;Imprimer / PDF&quot;.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-4">Apercu</h2>
              <div className="min-h-[420px] p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                {generatedMarkdown ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">
                    {generatedMarkdown}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[380px]">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                        <span className="text-[#c41e3a] text-xl">CV</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Clique sur &quot;Generer mon CV&quot; pour voir l&apos;apercu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Astuce : complete tes infos CV dans{" "}
                <Link href="/profil" className="text-[#c41e3a] hover:text-[#c41e3a] underline transition-colors">
                  ton profil
                </Link>{" "}
                pour une meilleure qualite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
