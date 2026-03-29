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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
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
          roleLabel: user.role === "etudiant" ? "Étudiant" : "Nouveau bachelier",
          cvProfile,
        }),
      });
      const data = (await res.json()) as { markdown?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Erreur lors de la génération");
      setGeneratedMarkdown(data.markdown || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMarkdownToProfile = () => {
    // optionnel : stocker la version générée dans le profil pour la retrouver
    updateUser({
      cvProfile: {
        ...cvProfile,
        // on garde le profil, la version markdown reste côté page pour l'instant
      },
    });
  };

  const renderList = (items: string[]) =>
    items.length ? (
      <ul className="list-disc list-inside text-sm text-slate-800">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-500">Non renseigné</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Générateur de CV
            </h1>
            <p className="text-gray-600 mt-1">
              Génère automatiquement ton CV à partir de ton profil, avec OpenAI.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profil"
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white"
            >
              ← Retour profil
            </Link>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white"
              type="button"
            >
              Imprimer / PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Modèle OpenAI configuré via <span className="font-mono">OPENAI_MODEL</span>{" "}
              dans <span className="font-mono">.env.local</span>.
            </div>
            <button
              onClick={generate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold disabled:opacity-60"
              type="button"
            >
              {isGenerating ? "Génération en cours..." : "Générer mon CV"}
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {/* Aperçu stylé pour impression */}
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">
              Aperçu stylé (impression)
            </h2>
            <div className="rounded-xl border border-slate-200 p-6 bg-white print:border-0 print:shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-700">
                    {cvProfile.headline || "Titre / poste visé"}
                  </p>
                </div>
                <div className="text-sm text-slate-700 space-y-1">
                  <p>Email : {user.email}</p>
                  {cvProfile.phone && <p>Téléphone : {cvProfile.phone}</p>}
                  {cvProfile.location && <p>Localisation : {cvProfile.location}</p>}
                </div>
              </div>

              {cvProfile.about && (
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-1">À propos</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {cvProfile.about}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Compétences</h4>
                  {renderList(cvProfile.skills)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Langues</h4>
                  {renderList(cvProfile.languages)}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-1">Formation</h4>
                {cvProfile.education.length ? (
                  <div className="space-y-2">
                    {cvProfile.education.map((ed, idx) => (
                      <div key={idx} className="text-sm text-slate-800">
                        <p className="font-semibold">
                          {ed.degree || "Diplôme"} — {ed.school || "Établissement"}
                        </p>
                        <p className="text-slate-600 text-xs">
                          {ed.startYear || "Début"} - {ed.endYear || "Fin"}
                        </p>
                        {ed.details && <p className="text-slate-700">{ed.details}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Non renseigné</p>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-1">Expériences</h4>
                {cvProfile.experiences.length ? (
                  <div className="space-y-3">
                    {cvProfile.experiences.map((exp, idx) => (
                      <div key={idx} className="text-sm text-slate-800">
                        <p className="font-semibold">
                          {exp.title || "Poste"} — {exp.company || "Organisation"}
                        </p>
                        <p className="text-slate-600 text-xs">
                          {exp.start || "Début"} - {exp.end || "Présent"}
                          {exp.location ? ` • ${exp.location}` : ""}
                        </p>
                        {renderList(exp.bullets.filter(Boolean))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Non renseigné</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Projets</h4>
                {cvProfile.projects.length ? (
                  <div className="space-y-3">
                    {cvProfile.projects.map((pr, idx) => (
                      <div key={idx} className="text-sm text-slate-800">
                        <p className="font-semibold">
                          {pr.name || "Projet"}
                          {pr.link && (
                            <span className="text-slate-600"> ({pr.link})</span>
                          )}
                        </p>
                        {pr.description && (
                          <p className="text-slate-700">{pr.description}</p>
                        )}
                        {renderList(pr.bullets.filter(Boolean))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Non renseigné</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">
                Sortie (Markdown)
              </h2>
              <textarea
                value={generatedMarkdown}
                onChange={(e) => setGeneratedMarkdown(e.target.value)}
                placeholder="Le CV généré apparaîtra ici..."
                className="w-full min-h-[420px] p-4 rounded-xl border border-slate-200 focus:border-violet-400 outline-none font-mono text-sm"
              />
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedMarkdown);
                  }}
                  disabled={!generatedMarkdown}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-50"
                >
                  Copier
                </button>
                <button
                  type="button"
                  onClick={saveMarkdownToProfile}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white"
                >
                  Sauvegarder (profil)
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Pour une exportation propre, utilise “Imprimer / PDF”.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Aperçu</h2>
              <div className="min-h-[420px] p-5 rounded-xl border border-slate-200 bg-slate-50">
                {generatedMarkdown ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-900">
                    {generatedMarkdown}
                  </pre>
                ) : (
                  <div className="text-sm text-slate-500">
                    Clique sur “Générer mon CV” pour voir l’aperçu.
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Astuce : complète tes infos CV dans{" "}
                <Link href="/profil" className="underline">
                  ton profil
                </Link>{" "}
                pour une meilleure qualité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

