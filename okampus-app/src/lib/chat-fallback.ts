import { findInstitutionsForTopic, formatInstitutionFilières } from "@/lib/universities";

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
  if (lower.includes("medecin") || lower.includes("pharmacie") || lower.includes("santé")) {
    return "santé";
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
      "Pour te orienter correctement, dis-moi d'abord **ta serie au bac** en Guinée :",
      "- Sciences Mathématiques (SM)",
      "- Sciences Expérimentales (SE)",
      "- Sciences Sociales (SS)",
      ""
    );
  }

  if (topic === "santé") {
    if (serie === "se" || serie === "sm") {
      lines.push(
        "## Filières",
        "- Médecine, Pharmacie, Sciences infirmières (très sélectif — prépare-toi tot)",
        "",
        "## Conseils",
        "- Vérifie les conditions d'admission à l'UGANC ou l'Université Kofi Annan",
        "- Parle à un étudiant en médecine pour un retour concret"
      );
    } else {
      lines.push(
        "## Filières",
        "- Sciences infirmières, Sante publique, ou passerelle vers SE/SM selon ton parcours",
        "",
        "## Conseils",
        "- La médecine classique demande surtout SE ou SM — un mentor peut t'expliquer les options"
      );
    }
  } else if (topic === "info") {
    lines.push(
      "## Filières",
      "- Informatique, Génie logiciel, Réseaux (SM ideal, possible depuis SE avec bon niveau maths)",
      "",
      "## Conseils",
      "- Renforce les maths et pratique la logique (Python, sites web)",
      "- Demande aux mentors en informatique sur BacheliO"
    );
  } else if (topic === "droit") {
    lines.push(
      "## Filières",
      "- Droit, Sciences politiques, Journalisme (SS ou SM selon l'université)",
      "",
      "## Conseils",
      "- Travaille l'expression écrite et la culture generale",
      "- Visite le forum pour les retours sur les filières juridiques"
    );
  } else if (serie === "sm") {
    lines.push(
      "## Filières",
      "- Informatique, Génie civil, Sciences économiques, Architecture",
      "",
      "## Conseils",
      "- Précise ton projet (métier visé) pour affiner",
      "- Compare 2 filières avec un mentor étudiant"
    );
  } else if (serie === "se") {
    lines.push(
      "## Filières",
      "- Médecine, Pharmacie, Agronomie, Sciences de la Vie",
      "",
      "## Conseils",
      "- Les filières santé sont très demandées — anticipe la préparation",
      "- Discute avec un mentor de ta serie"
    );
  } else if (serie === "ss") {
    lines.push(
      "## Filières",
      "- Droit, Gestion, Journalisme, Sciences politiques",
      "",
      "## Conseils",
      "- Valorise tes points forts en langues et redaction",
      "- Explore le forum pour les témoignages"
    );
  } else {
    lines.push(
      "## Pour avancer",
      "- Dis-moi ta **serie au bac** et ton **projet d'études**",
      "- Je te proposerai 2 filières réalistes en Guinée",
      "",
      "## En attendant",
      "- Un mentor étudiant peut répondre plus précisément à ta situation"
    );
  }

  lines.push(
    "",
    "## Établissements en Guinée"
  );

  const institutions = findInstitutionsForTopic(userMessage, 3);
  if (institutions.length > 0) {
    for (const inst of institutions) {
      lines.push(
        `- **${inst.shortName}** (${inst.city}, ${inst.sector === "public" ? "public" : "privé"}) : ${formatInstitutionFilières(inst, 4)}`
      );
    }
    lines.push("- [Voir toutes les universités et écoles](/universites)");
  } else {
    lines.push("- Consulte le [référentiel complet](/universites) pour comparer les établissements.");
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
    return "Credits DeepSeek épuisés — ajoute des credits sur platform.deepseek.com ou réessaie plus tard.";
  }
  if (
    error.includes("UNABLE_TO_VERIFY") ||
    error.includes("certificate") ||
    error.includes("SSL")
  ) {
    return "Erreur de connexion au service IA — réessaie dans un instant.";
  }
  if (error.includes("401") || error.includes("Authentication") || error.includes("invalid")) {
    return "Cle API DeepSeek invalide — vérifie DEEPSEEK_API_KEY sur le serveur.";
  }
  if (error.includes("timeout") || error.includes("ETIMEDOUT") || error.includes("fetch failed")) {
    return "Délai dépassé — vérifie ta connexion et réessaie.";
  }
  return "Service IA temporairement indisponible.";
}
