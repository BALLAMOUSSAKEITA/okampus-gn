export type InstitutionSector = "public" | "privé";
export type InstitutionKind = "université" | "institut";

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  sector: InstitutionSector;
  kind: InstitutionKind;
  city: string;
  description: string;
  filieres: string[];
  website?: string;
}

export const INSTITUTIONS: Institution[] = [
  {
    id: "uganc",
    name: "Université Gamal Abdel Nasser de Conakry",
    shortName: "UGANC",
    sector: "public",
    kind: "université",
    city: "Conakry",
    description:
      "Université publique guinéenne spécialisée dans les sciences, les technologies et les professions de santé. Fondée en 1962, c'est la plus ancienne institution d'enseignement supérieur du pays.",
    filieres: [
      "Génie Informatique",
      "Génie civil",
      "Génie Chimique",
      "Génie électrique",
      "Génie Industriel et Maintenance",
      "Génie Mécanique",
      "Telecommunications",
      "Mathématiques",
      "Physique",
      "Médecine",
      "Odontostomatologie",
      "Pharmacie",
      "Biologie",
      "Biochimie",
    ],
    website: "https://uganc.edu.gn/",
  },
  {
    id: "uglcs",
    name: "Université General Lansana Conte de Sonfonia",
    shortName: "UGLC-SC",
    sector: "public",
    kind: "université",
    city: "Conakry",
    description:
      "Université publique créée en 2005, l'un des principaux établissements du pays dans les sciences humaines, sciences sociales, droit, économie et lettres.",
    filieres: [
      "Droit privé",
      "Droit public",
      "Sciences politiques",
      "Sciences économiques",
      "Administration des affaires",
      "Sciences comptables",
      "Banques et Finances",
      "Gestion logistique et Transport",
      "Sociologie",
      "Histoire",
      "Géographie",
      "Philosophie",
      "Lettres Modernes",
      "Sciences de Langage",
      "Langue Anglaise",
      "Langue et Civilisation arabes",
    ],
    website: "https://uglcs.org/home/",
  },
  {
    id: "ujnk",
    name: "Université Julius Nyerere de Kankan",
    shortName: "UJNK",
    sector: "public",
    kind: "université",
    city: "Kankan",
    description:
      "Université publique de Kankan, deuxième plus grande ville de Guinée. Rôle important dans la formation universitaire et la recherche en Haute-Guinée.",
    filieres: [
      "Sciences de la nature",
      "Sciences sociales",
      "Sciences économiques et de gestion",
      "Lettres et langue",
    ],
  },
  {
    id: "univ-kindia",
    name: "Université de Kindia",
    shortName: "Univ. Kindia",
    sector: "public",
    kind: "université",
    city: "Kindia",
    description:
      "Université publique située à Foulayah, préfecture de Kindia. Renforce l'enseignement supérieur dans l'ouest de la Guinée.",
    filieres: [
      "Langues et Lettres",
      "Sciences",
      "Sciences économiques et de Gestion",
      "Sciences Sociales",
    ],
    website: "https://univ-kindia.com/",
  },
  {
    id: "univ-labe",
    name: "Université de Labe",
    shortName: "Univ. Labe",
    sector: "public",
    kind: "université",
    city: "Labe",
    description:
      "Université publique fondée en 2001, autonome depuis 2016. Positionnement marqué dans les sciences, la recherche et les technologies innovantes.",
    filieres: [
      "Informatique",
      "Biologie",
      "MIAGE",
      "Mathématiques",
      "Photovoltaique",
      "Langue Arabe",
      "Administration publique",
      "Gestion",
      "Économie",
      "Économie sociale et solidaire",
    ],
    website: "https://univ-labe.edu.gn/",
  },
  {
    id: "univ-nzerekore",
    name: "Université de N'Zerekore",
    shortName: "UZ",
    sector: "public",
    kind: "université",
    city: "N'Zerekore",
    description:
      "Université publique créée en 2001, formation des étudiants de la région forestière. Enseignement principalement en français.",
    filieres: [
      "Génie de l'environnement",
      "Gestion des ressources naturelles",
      "Hydrologie",
      "Meteorologie",
      "Biologie",
      "Chimie",
      "Mathématiques",
      "Physique",
    ],
    website: "https://ent.univ-nzerekore.net/",
  },
  {
    id: "isav-faranah",
    name: "Institut Supérieur Agronomique et Vétérinaire de Faranah",
    shortName: "ISAV Faranah",
    sector: "public",
    kind: "institut",
    city: "Faranah",
    description:
      "Établissement public fonde en 1978, spécialisé dans les sciences agronomiques, l'elevage et les disciplines veterinaires.",
    filieres: [
      "Agriculture",
      "Agroforesterie",
      "Eaux et forets environnement",
      "Sciences animales",
      "Génie rural",
      "Gestion des entreprises",
      "Économie Agricole",
      "Économie Rurale",
      "Vulgarisation agricole",
    ],
  },
  {
    id: "ismgb-boke",
    name: "Institut Supérieur des Mines et Géologie de Boke",
    shortName: "ISMGB",
    sector: "public",
    kind: "institut",
    city: "Boke",
    description:
      "Établissement public spécialisé dans les sciences de la Terre, les mines et l'ingenierie, en lien avec le secteur minier guinéen.",
    filieres: [
      "Environnement et Sécurité industrielle",
      "Services Géologiques",
      "Services Miniers",
      "Traitement et Metallurgie",
    ],
    website: "https://ismgb.net/",
  },
  {
    id: "ist-mamou",
    name: "Institut Supérieur de Technologie de Mamou",
    shortName: "IST-Mamou",
    sector: "public",
    kind: "institut",
    city: "Mamou",
    description:
      "Établissement public cree en 2004, spécialisé dans les formations techniques et technologiques. Pôle de formation d'ingenieurs.",
    filieres: [
      "Génie Informatique",
      "Énergétique",
      "Instrumentation et Mesures Physiques",
      "Techniques de Laboratoire",
    ],
    website: "https://www.ist-mamou.org/",
  },
  {
    id: "ukag",
    name: "Université Kofi Annan de Guinée",
    shortName: "UKAG",
    sector: "privé",
    kind: "université",
    city: "Conakry",
    description:
      "Université privée pluridisciplinaire fondée en 1999. Formations du BTS au doctorat dans plusieurs disciplines.",
    filieres: [
      "Comptabilite et Gestion Financiere",
      "Gestion des Ressources humaines",
      "Monnaie Banque Finances",
      "Analyse et Politique Economique",
      "Marketing et Strategie",
      "Droit",
      "Administration Publique",
      "Relations Internationales",
      "Journalisme",
      "Communication",
      "Sociologie",
      "Génie logiciel",
      "Réseaux et Systemes",
      "Médecine",
      "Pharmacie",
      "Odontologie",
      "Génie Civil",
      "Génie Minier",
      "Architecture",
      "Génie Electrique",
      "Génie Informatique",
      "Logistique et Transport",
      "Tourisme et Hotellerie",
    ],
    website: "https://ukaguinee.org/Accueil",
  },
  {
    id: "unc",
    name: "Université de Nongo Conakry",
    shortName: "UNC",
    sector: "privé",
    kind: "université",
    city: "Conakry",
    description:
      "Université privée de Conakry proposant des formations en génie, sciences économiques, juridiques et sociales.",
    filieres: [
      "Génie Informatique et telecommunications",
      "MIAGE",
      "Génie Electronique",
      "Génie civil",
      "Génie mineral",
      "Économie",
      "Sciences comptables",
      "Administration des affaires",
      "Banques et assurances",
      "Logistique et transport",
      "Transit-Douane-Commerce international",
      "Droit",
      "Sciences politiques",
      "Communication",
      "Sociologie",
    ],
    website: "https://unc-edu.org/",
  },
  {
    id: "umi",
    name: "Université Mercure International",
    shortName: "UMI",
    sector: "privé",
    kind: "université",
    city: "Conakry",
    description:
      "Université privée à Conakry, approche professionnalisante et partenariats académiques.",
    filieres: [
      "Génie informatique",
      "Génie Réseaux",
      "Génie logiciels",
      "Journalisme",
      "Communication",
      "Transport logistique",
      "Douane Transit",
      "Commerce International",
    ],
  },
];

export function getInstitutionCities(): string[] {
  return Array.from(new Set(INSTITUTIONS.map((i) => i.city))).sort((a, b) =>
    a.localeCompare(b, "fr")
  );
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterInstitutions(options: {
  query?: string;
  sector?: InstitutionSector | "all";
  kind?: InstitutionKind | "all";
  city?: string;
}): Institution[] {
  const query = normalizeText(options.query?.trim() || "");

  return INSTITUTIONS.filter((inst) => {
    if (options.sector && options.sector !== "all" && inst.sector !== options.sector) {
      return false;
    }
    if (options.kind && options.kind !== "all" && inst.kind !== options.kind) {
      return false;
    }
    if (options.city && options.city !== "all" && inst.city !== options.city) {
      return false;
    }
    if (!query) return true;

    const haystack = normalizeText(
      [inst.name, inst.shortName, inst.city, inst.description, ...inst.filieres].join(" ")
    );
    return query.split(/\s+/).every((term) => haystack.includes(term));
  });
}

export function findInstitutionsForTopic(message: string, limit = 3): Institution[] {
  const lower = normalizeText(message);
  const scored = INSTITUTIONS.map((inst) => {
    let score = 0;
    for (const filière of inst.filieres) {
      const norm = normalizeText(filière);
      const words = norm.split(/\s+/).filter((w) => w.length > 3);
      for (const word of words) {
        if (lower.includes(word)) score += 2;
      }
    }
    if (lower.includes(normalizeText(inst.city))) score += 3;
    if (lower.includes(normalizeText(inst.shortName))) score += 5;
    if (lower.includes("medecin") || lower.includes("pharmacie")) {
      if (inst.filieres.some((f) => /médecine|pharmacie|odontologie/i.test(f))) score += 4;
    }
    if (lower.includes("informatique") || lower.includes("info")) {
      if (inst.filieres.some((f) => /informatique|logiciel|miage|réseau/i.test(f))) score += 4;
    }
    if (lower.includes("droit")) {
      if (inst.filieres.some((f) => /droit|juridique|politique/i.test(f))) score += 4;
    }
    if (lower.includes("agronom") || lower.includes("agricol")) {
      if (inst.id === "isav-faranah") score += 6;
    }
    if (lower.includes("mine") || lower.includes("geolog")) {
      if (inst.id === "ismgb-boke") score += 6;
    }
    return { inst, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ inst }) => inst);
}

/** Contexte compact injecte dans le prompt de l'assistant IA. */
export function buildUniversitiesContextForAI(userMessage?: string): string {
  const relevant = userMessage
    ? findInstitutionsForTopic(userMessage, 5)
    : INSTITUTIONS.slice(0, 6);

  const list = (relevant.length > 0 ? relevant : INSTITUTIONS).map((inst) => {
    const filieresPreview = inst.filieres.slice(0, 8).join(", ");
    const extra = inst.filieres.length > 8 ? ` (+${inst.filieres.length - 8} autres)` : "";
    const web = inst.website ? ` | ${inst.website}` : "";
    return `- **${inst.shortName}** (${inst.city}, ${inst.sector === "public" ? "public" : "privé"}) : ${filieresPreview}${extra}${web}`;
  });

  return `## Référentiel établissements Guinée (source BacheliO — cite uniquement si pertinent)
${list.join("\n")}

Regles :
- Recommande 1 à 2 établissements maximum quand l'étudiant demande ou étudier.
- Précise la ville et si l'établissement est public ou privé.
- Pour la liste complète : [Universités & Écoles](/universites)
- Ne cite pas d'établissement hors de ce référentiel sauf si l'étudiant en parle déjà.`;
}

export function formatInstitutionFilières(inst: Institution, max = 6): string {
  const shown = inst.filieres.slice(0, max);
  const rest = inst.filieres.length - shown.length;
  return rest > 0 ? `${shown.join(", ")} (+${rest})` : shown.join(", ");
}
