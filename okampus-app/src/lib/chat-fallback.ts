import { findInstitutionsForTopic, formatInstitutionFilieres } from "@/lib/universities";

function detectSerie(text: string): "sm" | "se" | "ss" | null {
  const lower = text.toLowerCase();
  if (
    lower.includes("sciences mathematiques") ||
    lower.includes("science mathematique") ||
    /\bsm\b/.test(lower) ||
    lower.includes("serie sm")
  ) {
    return "sm";
  }
  if (
    lower.includes("sciences experimentales") ||
    lower.includes("science experimentale") ||
    /\bse\b/.test(lower) ||
    lower.includes("serie se")
  ) {
    return "se";
  }
  if (
    lower.includes("sciences sociales") ||
    lower.includes("science sociale") ||
    /\bss\b/.test(lower) ||
    lower.includes("serie ss")
  ) {
    return "ss";
  }
  return null;
}

function detectTopic(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("medecin") || lower.includes("pharmacie") || lower.includes("sante")) {
    return "sante";
  }
  if (lower.includes("informatique") || lower.includes("info") || lower.includes("tech")) {
    return "info";
  }
  if (lower.includes("droit") || lower.includes("avocat") || lower.includes("jurid")) {
    return "droit";
  }
  if (lower.includes("ingenier") || lower.includes("genie")) {
    return "ingenierie";
  }
  if (lower.includes("gestion") || lower.includes("commerce") || lower.includes("eco")) {
    return "gestion";
  }
  return null;
}

/** Reponse locale quand DeepSeek est indisponible (chat libre). */
export function generateChatFallback(userMessage: string): string {
  const serie = detectSerie(userMessage);
  const topic = detectTopic(userMessage);
  const lines: string[] = [];

  lines.push(
    "*Je suis en mode secours (IA temporairement indisponible), voici ce que je peux te proposer :*",
    ""
  );

  if (!serie) {
    lines.push(
      "Pour te orienter correctement, dis-moi d'abord **ta serie au bac** en Guinee :",
      "- Sciences Mathematiques (SM)",
      "- Sciences Experimentales (SE)",
      "- Sciences Sociales (SS)",
      ""
    );
  }

  if (topic === "sante") {
    if (serie === "se" || serie === "sm") {
      lines.push(
        "## Filieres",
        "- Medecine, Pharmacie, Sciences infirmieres (tres selectif — prepare-toi tot)",
        "",
        "## Conseils",
        "- Verifie les conditions d'admission a l'UGANC ou l'Universite Kofi Annan",
        "- Parle a un etudiant en medecine pour un retour concret"
      );
    } else {
      lines.push(
        "## Filieres",
        "- Sciences infirmieres, Sante publique, ou passerelle vers SE/SM selon ton parcours",
        "",
        "## Conseils",
        "- La medecine classique demande surtout SE ou SM — un mentor peut t'expliquer les options"
      );
    }
  } else if (topic === "info") {
    lines.push(
      "## Filieres",
      "- Informatique, Genie logiciel, Reseaux (SM ideal, possible depuis SE avec bon niveau maths)",
      "",
      "## Conseils",
      "- Renforce les maths et pratique la logique (Python, sites web)",
      "- Demande aux mentors en informatique sur BacheliO"
    );
  } else if (topic === "droit") {
    lines.push(
      "## Filieres",
      "- Droit, Sciences politiques, Journalisme (SS ou SM selon l'universite)",
      "",
      "## Conseils",
      "- Travaille l'expression ecrite et la culture generale",
      "- Visite le forum pour les retours sur les filieres juridiques"
    );
  } else if (serie === "sm") {
    lines.push(
      "## Filieres",
      "- Informatique, Genie civil, Sciences economiques, Architecture",
      "",
      "## Conseils",
      "- Precise ton projet (metier visé) pour affiner",
      "- Compare 2 filieres avec un mentor etudiant"
    );
  } else if (serie === "se") {
    lines.push(
      "## Filieres",
      "- Medecine, Pharmacie, Agronomie, Sciences de la Vie",
      "",
      "## Conseils",
      "- Les filieres sante sont tres demandees — anticipe la preparation",
      "- Discute avec un mentor de ta serie"
    );
  } else if (serie === "ss") {
    lines.push(
      "## Filieres",
      "- Droit, Gestion, Journalisme, Sciences politiques",
      "",
      "## Conseils",
      "- Valorise tes points forts en langues et redaction",
      "- Explore le forum pour les temoignages"
    );
  } else {
    lines.push(
      "## Pour avancer",
      "- Dis-moi ta **serie au bac** et ton **projet d'etudes**",
      "- Je te proposerai 2 filieres realistes en Guinee",
      "",
      "## En attendant",
      "- Un mentor etudiant peut repondre plus precisement a ta situation"
    );
  }

  lines.push(
    "",
    "## Etablissements en Guinee"
  );

  const institutions = findInstitutionsForTopic(userMessage, 3);
  if (institutions.length > 0) {
    for (const inst of institutions) {
      lines.push(
        `- **${inst.shortName}** (${inst.city}, ${inst.sector === "public" ? "public" : "prive"}) : ${formatInstitutionFilieres(inst, 4)}`
      );
    }
    lines.push("- [Voir toutes les universites et ecoles](/universites)");
  } else {
    lines.push("- Consulte le [referentiel complet](/universites) pour comparer les etablissements.");
  }

  lines.push(
    "",
    "## Suite",
    "1. [Clique ici pour contacter un mentor](/conseil)",
    "2. [Poser ma question sur le forum](/forum)"
  );

  return lines.join("\n");
}

export function mapAssistantErrorMessage(error: string): string {
  if (error.includes("Insufficient Balance") || error.includes("402")) {
    return "Credits DeepSeek epuises — ajoute des credits sur platform.deepseek.com ou reessaie plus tard.";
  }
  if (
    error.includes("UNABLE_TO_VERIFY") ||
    error.includes("certificate") ||
    error.includes("SSL")
  ) {
    return "Erreur de connexion au service IA — reessaie dans un instant.";
  }
  if (error.includes("401") || error.includes("Authentication") || error.includes("invalid")) {
    return "Cle API DeepSeek invalide — verifie DEEPSEEK_API_KEY sur le serveur.";
  }
  if (error.includes("timeout") || error.includes("ETIMEDOUT") || error.includes("fetch failed")) {
    return "Delai depasse — verifie ta connexion et reessaie.";
  }
  return "Service IA temporairement indisponible.";
}
