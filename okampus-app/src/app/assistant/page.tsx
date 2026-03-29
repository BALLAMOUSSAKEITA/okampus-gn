"use client";

import { useState } from "react";
import Link from "next/link";

interface OrientationData {
  projectEtudes: string;
  forces: string;
  faiblesses: string;
  notes: string;
  serieBac: string;
  passions: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function generateOrientationAdvice(data: OrientationData): string {
  const forces = data.forces.split(",").map((f) => f.trim()).filter(Boolean);
  const faiblesses = data.faiblesses.split(",").map((f) => f.trim()).filter(Boolean);
  const passions = data.passions.split(",").map((p) => p.trim()).filter(Boolean);

  const notesMap: Record<string, number> = {};
  data.notes.split(",").forEach((n) => {
    const [mat, val] = n.split(":").map((s) => s.trim());
    if (mat && val) notesMap[mat] = parseFloat(val) || 0;
  });

  let recommandations: string[] = [];
  let conseils: string[] = [];

  const bonEnMath = (notesMap["Math"] || notesMap["Mathématiques"] || 0) >= 12;
  const bonEnScience = (notesMap["Physique"] || 0) >= 12 || (notesMap["SVT"] || notesMap["Sciences"] || 0) >= 12;

  if (data.serieBac?.toLowerCase().includes("scientifique") || data.serieBac?.toLowerCase().includes("mathématiques")) {
    if (bonEnMath && bonEnScience) {
      recommandations.push("Médecine", "Pharmacie", "Sciences", "Génie Civil", "Informatique");
    } else if (bonEnMath) {
      recommandations.push("Informatique", "Sciences Économiques", "Génie");
    } else if (bonEnScience) {
      recommandations.push("Sciences de la Vie", "Agronomie");
    }
  } else if (data.serieBac?.toLowerCase().includes("sociale") || data.serieBac?.toLowerCase().includes("lettre")) {
    recommandations.push("Droit", "Lettres", "Sciences Politiques", "Commerce", "Journalisme");
  } else if (data.serieBac?.toLowerCase().includes("technique")) {
    recommandations.push("Génie Civil", "Électrotechnique", "Mécanique", "Informatique");
  } else {
    recommandations = ["Médecine", "Droit", "Informatique", "Commerce", "Génie Civil"];
  }

  if (data.projectEtudes) {
    const projet = data.projectEtudes.toLowerCase();
    if (projet.includes("médecin") || projet.includes("santé")) {
      recommandations = ["Médecine", "Pharmacie", "Sciences Infirmières", ...recommandations.filter((f) => !f.includes("Médecine"))];
    } else if (projet.includes("droit") || projet.includes("avocat")) {
      recommandations = ["Droit", "Sciences Politiques", ...recommandations.filter((f) => f !== "Droit")];
    } else if (projet.includes("informatique") || projet.includes("tech")) {
      recommandations = ["Informatique", "Génie Logiciel", ...recommandations.filter((f) => f !== "Informatique")];
    }
  }

  if (faiblesses.length > 0) {
    conseils.push(`Points à améliorer : ${faiblesses.join(", ")}. Renforce ces matières avant la rentrée.`);
  }
  if (forces.length > 0) {
    conseils.push(`Tes forces : ${forces.join(", ")}. Elles correspondent bien aux filières recommandées.`);
  }
  conseils.push("Discute avec un conseiller étudiant pour un retour terrain.");
  conseils.push("Consulte le forum pour les témoignages sur les universités.");

  const recoText = [...new Set(recommandations)].slice(0, 5).join(", ");

  return `Mon analyse de ton profil\n\nProjet : ${data.projectEtudes || "À définir"}\nSérie : ${data.serieBac || "Non précisé"}\n\nFilières recommandées\n${recoText}\n\nConseils personnalisés\n${conseils.join("\n")}\n\nProchaines étapes\n1. Parle à un conseiller (section Conseillers)\n2. Pose tes questions sur le forum\n3. Prends rendez-vous pour un appel approfondi`;
}

export default function AssistantPage() {
  const [step, setStep] = useState<"form" | "chat">("form");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [orientationData, setOrientationData] = useState<OrientationData>({
    projectEtudes: "",
    forces: "",
    faiblesses: "",
    notes: "",
    serieBac: "",
    passions: "",
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const advice = generateOrientationAdvice(orientationData);
    setMessages([
      {
        role: "assistant",
        content: `Bonjour ! J'ai analysé ton profil. Voici mes recommandations :\n\n${advice}`,
      },
    ]);
    setStep("chat");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputMessage.trim() },
    ]);
    setInputMessage("");

    const lower = inputMessage.toLowerCase();
    let response = "";
    if (lower.includes("conseiller") || lower.includes("parler")) {
      response = "Va dans la section Conseillers et choisis un étudiant dans les filières recommandées. Tu peux aussi prendre rendez-vous pour un appel Meet.";
    } else if (lower.includes("universit") || lower.includes("uganc") || lower.includes("gamal")) {
      response = "Consulte le Forum pour les discussions sur les universités guinéennes. Tu peux aussi poser ta propre question.";
    } else if (lower.includes("merci") || lower.includes("ok")) {
      response = "Avec plaisir ! Bonne chance pour ton orientation.";
    } else {
      response = "Je te recommande de discuter avec un conseiller étudiant pour des conseils concrets. Explore aussi le forum. Que puis-je faire d'autre ?";
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }, 700);
  };

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-14">
        {/* Page Header */}
        <div className="card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c41e3a] to-[#9e1830] flex items-center justify-center shadow-md shadow-red-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Assistant <span className="text-gradient-primary">orientation</span>
              </h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm md:text-base pl-[52px]">
            Presente ton profil et recois des recommandations personnalisees
          </p>
        </div>

        {step === "form" ? (
          <form
            onSubmit={handleSubmitProfile}
            className="card rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 md:p-10 space-y-6 shadow-sm"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                Ton projet d'etudes
              </label>
              <input
                type="text"
                value={orientationData.projectEtudes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, projectEtudes: e.target.value })
                }
                placeholder="Ex: Medecin, Avocat, Developpeur..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                Serie au bac
              </label>
              <select
                value={orientationData.serieBac}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, serieBac: e.target.value })
                }
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600"
              >
                <option value="">Selectionne ta serie</option>
                <option value="Sciences Mathématiques">Sciences Mathematiques</option>
                <option value="Sciences Expérimentales">Sciences Experimentales</option>
                <option value="Sciences Sociales">Sciences Sociales</option>
                <option value="Lettres">Lettres</option>
                <option value="Technique">Technique</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                Tes notes (format: Math: 14, Physique: 12...)
              </label>
              <input
                type="text"
                value={orientationData.notes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, notes: e.target.value })
                }
                placeholder="Math: 14, Physique: 12, SVT: 15, Francais: 11"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                  Tes forces
                </label>
                <input
                  type="text"
                  value={orientationData.forces}
                  onChange={(e) =>
                    setOrientationData({ ...orientationData, forces: e.target.value })
                  }
                  placeholder="Analyse, Redaction..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                  Points a ameliorer
                </label>
                <input
                  type="text"
                  value={orientationData.faiblesses}
                  onChange={(e) =>
                    setOrientationData({ ...orientationData, faiblesses: e.target.value })
                  }
                  placeholder="Gestion du temps..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                Tes centres d'interet
              </label>
              <input
                type="text"
                value={orientationData.passions}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, passions: e.target.value })
                }
                placeholder="Sciences, Lecture, Sport..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-200 transition-all duration-200 text-sm tracking-wide"
            >
              Obtenir mon orientation
            </button>
          </form>
        ) : (
          <div className="card rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm flex flex-col h-[calc(100vh-280px)] md:h-[600px] shadow-sm overflow-hidden">
            <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/80 to-white/40">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c41e3a] to-[#9e1830] flex items-center justify-center mr-2.5 mt-1 flex-shrink-0 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3.5 ${
                      msg.role === "user"
                        ? "bg-[#c41e3a] text-white shadow-md shadow-red-200"
                        : "bg-white border border-slate-200 text-slate-700 shadow-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 md:p-5 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose une question..."
                  className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="btn-primary px-5 md:px-6 py-3 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-red-200 transition-all duration-200"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/conseil"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-[#c41e3a] font-medium text-sm hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Parler a un conseiller
          </Link>
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-[#c41e3a] font-medium text-sm hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            Explorer le forum
          </Link>
        </div>
      </div>
    </div>
  );
}
