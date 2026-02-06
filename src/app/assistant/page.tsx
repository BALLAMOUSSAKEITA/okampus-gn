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

// Moteur d'orientation basé sur les données (simule une IA)
function generateOrientationAdvice(data: OrientationData): string {
  const forces = data.forces.split(",").map((f) => f.trim()).filter(Boolean);
  const faiblesses = data.faiblesses.split(",").map((f) => f.trim()).filter(Boolean);
  const passions = data.passions.split(",").map((p) => p.trim()).filter(Boolean);
  
  // Parser les notes (format: "Math: 14, Physique: 12, ...")
  const notesMap: Record<string, number> = {};
  data.notes.split(",").forEach((n) => {
    const [mat, val] = n.split(":").map((s) => s.trim());
    if (mat && val) notesMap[mat] = parseFloat(val) || 0;
  });

  const filieresScience = ["Médecine", "Pharmacie", "Sciences", "Génie", "Informatique"];
  const filieresLettre = ["Droit", "Lettres", "Commerce", "Sciences Économiques", "Sciences Politiques"];
  const filieresTechnique = ["Génie Civil", "Électrotechnique", "Mécanique"];

  let recommandations: string[] = [];
  let conseils: string[] = [];

  // Analyse des forces/faiblesses
  const bonEnMath = (notesMap["Math"] || notesMap["Mathématiques"] || 0) >= 12;
  const bonEnScience = (notesMap["Physique"] || 0) >= 12 || (notesMap["SVT"] || notesMap["Sciences"] || 0) >= 12;
  const bonEnLettre = (notesMap["Français"] || notesMap["Philosophie"] || 0) >= 12;

  if (data.serieBac?.toLowerCase().includes("scientifique") || data.serieBac?.toLowerCase().includes("sciences")) {
    if (bonEnMath && bonEnScience) {
      recommandations.push("Médecine", "Pharmacie", "Sciences Exactes", "Génie Civil", "Informatique");
    } else if (bonEnMath) {
      recommandations.push("Informatique", "Sciences Économiques", "Génie");
    } else if (bonEnScience) {
      recommandations.push("Sciences de la Vie", "Agronomie");
    }
  } else if (data.serieBac?.toLowerCase().includes("lettre") || data.serieBac?.toLowerCase().includes("littéraire")) {
    recommandations.push("Droit", "Lettres Modernes", "Sciences Politiques", "Commerce", "Journalisme");
  } else if (data.serieBac?.toLowerCase().includes("technique")) {
    recommandations.push("Génie Civil", "Électrotechnique", "Mécanique", "Informatique");
  } else {
    recommandations = [...filieresScience, ...filieresLettre].slice(0, 5);
  }

  // Ajuster selon le projet
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

  // Conseils personnalisés
  if (faiblesses.length > 0) {
    conseils.push(`Pour tes points à améliorer (${faiblesses.join(", ")}), je te recommande de renforcer ces matières avant la rentrée. Des ressources sont disponibles sur le forum.`);
  }
  if (forces.length > 0) {
    conseils.push(`Tes forces (${forces.join(", ")}) sont un atout majeur ! Elles correspondent bien aux filières recommandées.`);
  }
  conseils.push("Je te conseille de discuter avec un conseiller étudiant dans les filières qui t'intéressent pour avoir un retour terrain.");
  conseils.push("Consulte le forum pour les témoignages sur les universités guinéennes (UGANC, Gamal, etc.).");

  const recoText = [...new Set(recommandations)].slice(0, 5).join(", ");
  
  return `## 🎯 Mon analyse de ton profil

**Projet d'études :** ${data.projectEtudes || "À définir"}

**Série au bac :** ${data.serieBac || "Non précisé"}

### Filières recommandées pour toi
${recoText}

### Mes conseils personnalisés
${conseils.join("\n\n")}

### Prochaines étapes
1. **Parle à un conseiller** – Choisis une filière ci-dessus et discute avec un étudiant qui la fait
2. **Pose tes questions** – Utilise le forum pour les universités et les concours
3. **Prends rendez-vous** – Pour un appel vidéo plus approfondi avec un conseiller

Souhaites-tu que je t'oriente vers un conseiller en particulier ?`;
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
        content: `Bonjour ! J'ai analysé ton profil d'orientation. Voici mes recommandations personnalisées :\n\n${advice}`,
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

    // Réponses contextuelles simulées
    const lower = inputMessage.toLowerCase();
    let response = "";
    if (lower.includes("conseiller") || lower.includes("parler")) {
      response = "Excellente idée ! Va dans la section **Conseil** et choisis un conseiller dans une des filières que je t'ai recommandées. Tu peux aussi **prendre rendez-vous** pour un appel Meet si tu préfères une discussion plus longue.";
    } else if (lower.includes("universit") || lower.includes("uganc") || lower.includes("gamal")) {
      response = "Consulte le **Forum** où tu trouveras des discussions sur les universités guinéennes. Tu peux aussi poser ta propre question ! Les conseillers étudiants ont une expérience terrain à partager.";
    } else if (lower.includes("merci") || lower.includes("ok") || lower.includes("d'accord")) {
      response = "Avec plaisir ! N'hésite pas à revenir si tu as d'autres questions. Bonne chance pour ton orientation ! 🎓";
    } else {
      response = "Je te recommande de discuter avec un conseiller étudiant dans la filière qui t'intéresse - ils pourront te donner des conseils très concrets. Tu peux aussi explorer le forum pour plus d'informations. Que puis-je faire d'autre pour toi ?";
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 Assistant IA d&apos;orientation
          </h1>
          <p className="text-gray-600">
            Présente ton profil et reçois des recommandations personnalisées
          </p>
        </div>

        {step === "form" ? (
          <form
            onSubmit={handleSubmitProfile}
            className="bg-white rounded-2xl shadow-xl border border-violet-100 p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ton projet d&apos;études (ce que tu aimerais faire)
              </label>
              <input
                type="text"
                value={orientationData.projectEtudes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, projectEtudes: e.target.value })
                }
                placeholder="Ex: Médecin, Avocat, Développeur..."
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Série au bac
              </label>
              <select
                value={orientationData.serieBac}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, serieBac: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 outline-none"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tes notes au lycée (format: Math: 14, Physique: 12, Français: 11...)
              </label>
              <input
                type="text"
                value={orientationData.notes}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, notes: e.target.value })
                }
                placeholder="Math: 14, Physique: 12, SVT: 15, Français: 11"
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tes forces (séparées par des virgules)
              </label>
              <input
                type="text"
                value={orientationData.forces}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, forces: e.target.value })
                }
                placeholder="Ex: Analyse, Rédaction, Travail en équipe..."
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tes points à améliorer
              </label>
              <input
                type="text"
                value={orientationData.faiblesses}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, faiblesses: e.target.value })
                }
                placeholder="Ex: Gestion du temps, Mathématiques..."
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tes passions / centres d&apos;intérêt
              </label>
              <input
                type="text"
                value={orientationData.passions}
                onChange={(e) =>
                  setOrientationData({ ...orientationData, passions: e.target.value })
                }
                placeholder="Ex: Sciences, Lecture, Sport..."
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-violet-200 transition-all"
            >
              Obtenir mon orientation personnalisée
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-violet-100 overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-violet-50 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {msg.content.split("\n").map((line, j) => {
                        if (line.startsWith("## ")) {
                          return <h3 key={j} className="text-lg font-bold mt-2 first:mt-0">{line.replace("## ", "")}</h3>;
                        }
                        if (line.startsWith("### ")) {
                          return <h4 key={j} className="text-base font-semibold mt-3">{line.replace("### ", "")}</h4>;
                        }
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return <p key={j} className="font-semibold">{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.startsWith("- ")) {
                          return <li key={j} className="ml-4">{line.replace("- ", "")}</li>;
                        }
                        return <p key={j} className="mb-1">{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-violet-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pose une question..."
                  className="flex-1 px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Link
            href="/conseil"
            className="text-violet-600 font-medium hover:underline"
          >
            → Parler à un conseiller humain
          </Link>
          <Link href="/forum" className="text-violet-600 font-medium hover:underline">
            → Explorer le forum
          </Link>
        </div>
      </div>
    </div>
  );
}
