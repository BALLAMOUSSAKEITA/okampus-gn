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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Assistant orientation
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Présente ton profil et reçois des recommandations personnalisées
          </p>
        </div>

        {step === "form" ? (
          <form
            onSubmit={handleSubmitProfile}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ton projet d'études
              </label>
              <input
                type="text"
                value={orientationData.projectEtudes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, projectEtudes: e.target.value })
                }
                placeholder="Ex: Médecin, Avocat, Développeur..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Série au bac
              </label>
              <select
                value={orientationData.serieBac}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, serieBac: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 outline-none"
              >
                <option value="">Sélectionne ta série</option>
                <option value="Sciences Mathématiques">Sciences Mathématiques</option>
                <option value="Sciences Expérimentales">Sciences Expérimentales</option>
                <option value="Sciences Sociales">Sciences Sociales</option>
                <option value="Lettres">Lettres</option>
                <option value="Technique">Technique</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tes notes (format: Math: 14, Physique: 12...)
              </label>
              <input
                type="text"
                value={orientationData.notes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, notes: e.target.value })
                }
                placeholder="Math: 14, Physique: 12, SVT: 15, Français: 11"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tes forces
                </label>
                <input
                  type="text"
                  value={orientationData.forces}
                  onChange={(e) =>
                    setOrientationData({ ...orientationData, forces: e.target.value })
                  }
                  placeholder="Analyse, Rédaction..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Points à améliorer
                </label>
                <input
                  type="text"
                  value={orientationData.faiblesses}
                  onChange={(e) =>
                    setOrientationData({ ...orientationData, faiblesses: e.target.value })
                  }
                  placeholder="Gestion du temps..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tes centres d'intérêt
              </label>
              <input
                type="text"
                value={orientationData.passions}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, passions: e.target.value })
                }
                placeholder="Sciences, Lecture, Sport..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Obtenir mon orientation
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-250px)] md:h-[600px]">
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-white border border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose une question..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 md:px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold text-sm hover:bg-violet-700 transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link
            href="/conseil"
            className="text-violet-600 font-medium hover:underline"
          >
            → Parler à un conseiller
          </Link>
          <Link href="/forum" className="text-violet-600 font-medium hover:underline">
            → Explorer le forum
          </Link>
        </div>
      </div>
    </div>
  );
}
