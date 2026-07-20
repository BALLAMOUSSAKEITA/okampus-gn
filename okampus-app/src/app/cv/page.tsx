"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { CvProfile } from "@/types";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
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

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/inscription?callbackUrl=/cv");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8]">
        <div className="animate-pulse text-[#6a697c] text-lg font-medium">Chargement...</div>
      </div>
    );
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
      <ul className="list-disc list-inside text-sm text-[#4d4c5c] space-y-0.5">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
    );

  return (
    <PageShell narrow>
      <PageHeader
        title="Generateur de CV"
        description="Genere automatiquement ton CV a partir de ton profil, avec OpenAI."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/profil" className="btn-secondary text-sm">
              Retour profil
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-secondary text-sm"
              type="button"
            >
              Imprimer / PDF
            </button>
          </div>
        }
      />

        {/* Main Card */}
        <div className="card border border-[#dcdce5] p-8">
          {/* Generate bar */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pb-8 border-b border-[#dcdce5]">
            <div className="text-sm text-[#4d4c5c]">
              Modele OpenAI configure via <span className="font-mono text-[#121117] bg-[#f4f4f8] px-1.5 py-0.5 rounded-md text-xs">OPENAI_MODEL</span>{" "}
              dans <span className="font-mono text-[#121117] bg-[#f4f4f8] px-1.5 py-0.5 rounded-md text-xs">.env.local</span>.
            </div>
            <button
              onClick={generate}
              disabled={isGenerating}
              className="btn-primary"
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
            <div className="mt-6 px-4 py-3 rounded-lg bg-[#f4f4f8] border border-[#dcdce5] text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Apercu style pour impression */}
          <div className="mt-8">
            <h2 className="font-semibold text-[#121117] text-sm uppercase tracking-wide mb-4">
              Apercu style (impression)
            </h2>
            <div className="card p-8 bg-white print:border-0 print:shadow-none print:p-0">
              {/* CV Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-[#dcdce5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#121117] tracking-tight">{user.name}</h3>
                  <p className="text-sm text-[#121117] font-medium mt-1">
                    {cvProfile.headline || "Titre / poste vise"}
                  </p>
                </div>
                <div className="text-sm text-[#4d4c5c] space-y-1.5">
                  <p className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#dcdce5]" />
                    {user.email}
                  </p>
                  {cvProfile.phone && (
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#dcdce5]" />
                      {cvProfile.phone}
                    </p>
                  )}
                  {cvProfile.location && (
                    <p className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#dcdce5]" />
                      {cvProfile.location}
                    </p>
                  )}
                </div>
              </div>

              {/* About */}
              {cvProfile.about && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-2">A propos</h4>
                  <p className="text-sm text-[#4d4c5c] whitespace-pre-wrap leading-relaxed">
                    {cvProfile.about}
                  </p>
                </div>
              )}

              {/* Skills & Languages */}
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-2">Competences</h4>
                  {cvProfile.skills.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cvProfile.skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#f4f4f8] text-[#4d4c5c] text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-2">Langues</h4>
                  {cvProfile.languages.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cvProfile.languages.map((l, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
                  )}
                </div>
              </div>

              {/* Formation */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-3">Formation</h4>
                {cvProfile.education.length ? (
                  <div className="space-y-3">
                    {cvProfile.education.map((ed, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-[#dcdce5]">
                        <p className="font-semibold text-[#121117]">
                          {ed.degree || "Diplome"} — {ed.school || "Etablissement"}
                        </p>
                        <p className="text-[#6a697c] text-xs mt-0.5">
                          {ed.startYear || "Debut"} - {ed.endYear || "Fin"}
                        </p>
                        {ed.details && <p className="text-[#4d4c5c] mt-1">{ed.details}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
                )}
              </div>

              {/* Experiences */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-3">Experiences</h4>
                {cvProfile.experiences.length ? (
                  <div className="space-y-4">
                    {cvProfile.experiences.map((exp, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-[#dcdce5]">
                        <p className="font-semibold text-[#121117]">
                          {exp.title || "Poste"} — {exp.company || "Organisation"}
                        </p>
                        <p className="text-[#6a697c] text-xs mt-0.5">
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
                  <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
                )}
              </div>

              {/* Projets */}
              <div>
                <h4 className="font-semibold text-[#121117] text-xs uppercase tracking-wider mb-3">Projets</h4>
                {cvProfile.projects.length ? (
                  <div className="space-y-4">
                    {cvProfile.projects.map((pr, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-[#dcdce5]">
                        <p className="font-semibold text-[#121117]">
                          {pr.name || "Projet"}
                          {pr.link && (
                            <span className="text-[#121117] font-normal ml-2 text-xs">({pr.link})</span>
                          )}
                        </p>
                        {pr.description && (
                          <p className="text-[#4d4c5c] mt-0.5">{pr.description}</p>
                        )}
                        <div className="mt-1.5">
                          {renderList(pr.bullets.filter(Boolean))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6a697c] italic">Non renseigne</p>
                )}
              </div>
            </div>
          </div>

          {/* Markdown output + Preview */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10 pt-8 border-t border-[#dcdce5]">
            <div>
              <h2 className="font-semibold text-[#121117] text-sm uppercase tracking-wide mb-4">
                Sortie (Markdown)
              </h2>
              <textarea
                value={generatedMarkdown}
                onChange={(e) => setGeneratedMarkdown(e.target.value)}
                placeholder="Le CV genere apparaitra ici..."
                className="w-full min-h-[420px] p-5 card bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none font-mono text-sm transition-all"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedMarkdown);
                  }}
                  disabled={!generatedMarkdown}
                  className="btn-secondary text-sm disabled:opacity-40"
                >
                  Copier
                </button>
                <button
                  type="button"
                  onClick={saveMarkdownToProfile}
                  className="btn-secondary text-sm"
                >
                  Sauvegarder (profil)
                </button>
              </div>
              <p className="text-xs text-[#6a697c] mt-3">
                Pour une exportation propre, utilise &quot;Imprimer / PDF&quot;.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#121117] text-sm uppercase tracking-wide mb-4">Apercu</h2>
              <div className="min-h-[420px] p-6 card bg-white">
                {generatedMarkdown ? (
                  <pre className="whitespace-pre-wrap text-sm text-[#121117] leading-relaxed">
                    {generatedMarkdown}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[380px]">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-[#f4f4f8] flex items-center justify-center mx-auto mb-3">
                        <span className="text-[#121117] text-xl">CV</span>
                      </div>
                      <p className="text-sm text-[#6a697c]">
                        Clique sur &quot;Generer mon CV&quot; pour voir l&apos;apercu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#6a697c] mt-3">
                Astuce : complete tes infos CV dans{" "}
                <Link href="/profil" className="text-[#121117] hover:text-[#121117] underline transition-colors">
                  ton profil
                </Link>{" "}
                pour une meilleure qualite.
              </p>
            </div>
          </div>
        </div>
    </PageShell>
  );
}
