import { normalizeBacSerie } from "@/lib/bac-options";

export interface OrientationProfile {
  projectEtudes: string;
  forces: string;
  faiblesses: string;
  notes: string;
  serieBac: string;
  passions: string;
}

export function generateOrientationAdvice(data: OrientationProfile): string {
  const forces = data.forces.split(",").map((f) => f.trim()).filter(Boolean);
  const faiblesses = data.faiblesses.split(",").map((f) => f.trim()).filter(Boolean);

  const notesMap: Record<string, number> = {};
  data.notes.split(",").forEach((n) => {
    const [mat, val] = n.split(":").map((s) => s.trim());
    if (mat && val) notesMap[mat] = parseFloat(val) || 0;
  });

  let recommandations: string[] = [];
  const conseils: string[] = [];

  const bonEnMath = (notesMap["Math"] || notesMap["Mathématiques"] || 0) >= 12;
  const bonEnScience =
    (notesMap["Physique"] || 0) >= 12 || (notesMap["SVT"] || notesMap["Sciences"] || 0) >= 12;

  const serie = normalizeBacSerie(data.serieBac);

  if (serie === "sm") {
    if (bonEnMath && bonEnScience) {
      recommandations.push("Informatique", "Génie Civil", "Sciences Économiques");
    } else if (bonEnMath) {
      recommandations.push("Informatique", "Statistiques", "Sciences Économiques");
    } else {
      recommandations.push("Génie Civil", "Architecture", "Commerce");
    }
  } else if (serie === "se") {
    if (bonEnScience) {
      recommandations.push("Médecine", "Pharmacie", "Sciences Infirmières");
    } else if (bonEnMath) {
      recommandations.push("Agronomie", "Sciences de la Vie", "Chimie");
    } else {
      recommandations.push("Agronomie", "Sciences de la Vie", "Sciences Infirmières");
    }
  } else if (serie === "ss") {
    recommandations.push("Droit", "Gestion", "Journalisme", "Sciences Politiques");
  } else {
    recommandations = ["Informatique", "Droit", "Gestion", "Médecine", "Génie Civil"];
  }

  if (data.projectEtudes) {
    const projet = data.projectEtudes.toLowerCase();
    if (projet.includes("médecin") || projet.includes("medecin") || projet.includes("sante") || projet.includes("santé")) {
      if (serie === "se" || serie === "sm") {
        recommandations = [
          "Médecine",
          "Pharmacie",
          "Sciences Infirmières",
          ...recommandations.filter((f) => !f.includes("Médecine")),
        ];
      } else {
        conseils.push(
          "La médecine est surtout accessible depuis Sciences Expérimentales ou Mathématiques — vérifie les conditions d'accès."
        );
        recommandations = ["Sciences Infirmières", "Santé publique", ...recommandations];
      }
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
  if (data.passions.trim()) {
    conseils.push(`Centres d'intérêt : ${data.passions}. Cherche des filières qui les valorisent.`);
  }
  conseils.push("Discute avec un conseiller étudiant pour un retour terrain.");
  conseils.push("Consulte le forum pour les témoignages sur les universités.");

  const recoText = [...new Set(recommandations)].slice(0, 3).join(", ");

  return `## Filières
- ${recoText}

## Conseils
${conseils.slice(0, 2).map((c) => `- ${c}`).join("\n")}

## Suite
1. [Clique ici pour contacter un mentor](/conseil)`;
}
