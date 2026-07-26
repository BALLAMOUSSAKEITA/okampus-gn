export type InstitutionSector = "public" | "prive";
export type InstitutionKind = "universite" | "institut";

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
    name: "Universite Gamal Abdel Nasser de Conakry",
    shortName: "UGANC",
    sector: "public",
    kind: "universite",
    city: "Conakry",
    description:
      "Universite publique guineenne specialisee dans les sciences, les technologies et les professions de sante. Fondee en 1962, c'est la plus ancienne institution d'enseignement superieur du pays.",
    filieres: [
      "Genie Informatique",
      "Genie civil",
      "Genie Chimique",
      "Genie electrique",
      "Genie Industriel et Maintenance",
      "Genie Mecanique",
      "Telecommunications",
      "Mathematiques",
      "Physique",
      "Medecine",
      "Odontostomatologie",
      "Pharmacie",
      "Biologie",
      "Biochimie",
    ],
    website: "https://uganc.edu.gn/",
  },
  {
    id: "uglcs",
    name: "Universite General Lansana Conte de Sonfonia",
    shortName: "UGLC-SC",
    sector: "public",
    kind: "universite",
    city: "Conakry",
    description:
      "Universite publique creee en 2005, l'un des principaux etablissements du pays dans les sciences humaines, sciences sociales, droit, economie et lettres.",
    filieres: [
      "Droit prive",
      "Droit public",
      "Sciences politiques",
      "Sciences economiques",
      "Administration des affaires",
      "Sciences comptables",
      "Banques et Finances",
      "Gestion logistique et Transport",
      "Sociologie",
      "Histoire",
      "Geographie",
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
    name: "Universite Julius Nyerere de Kankan",
    shortName: "UJNK",
    sector: "public",
    kind: "universite",
    city: "Kankan",
    description:
      "Universite publique de Kankan, deuxieme plus grande ville de Guinee. Role important dans la formation universitaire et la recherche en Haute-Guinee.",
    filieres: [
      "Sciences de la nature",
      "Sciences sociales",
      "Sciences economiques et de gestion",
      "Lettres et langue",
    ],
  },
  {
    id: "univ-kindia",
    name: "Universite de Kindia",
    shortName: "Univ. Kindia",
    sector: "public",
    kind: "universite",
    city: "Kindia",
    description:
      "Universite publique situee a Foulayah, prefecture de Kindia. Renforce l'enseignement superieur dans l'ouest de la Guinee.",
    filieres: [
      "Langues et Lettres",
      "Sciences",
      "Sciences economiques et de Gestion",
      "Sciences Sociales",
    ],
    website: "https://univ-kindia.com/",
  },
  {
    id: "univ-labe",
    name: "Universite de Labe",
    shortName: "Univ. Labe",
    sector: "public",
    kind: "universite",
    city: "Labe",
    description:
      "Universite publique fondee en 2001, autonome depuis 2016. Positionnement marque dans les sciences, la recherche et les technologies innovantes.",
    filieres: [
      "Informatique",
      "Biologie",
      "MIAGE",
      "Mathematiques",
      "Photovoltaique",
      "Langue Arabe",
      "Administration publique",
      "Gestion",
      "Economie",
      "Economie sociale et solidaire",
    ],
    website: "https://univ-labe.edu.gn/",
  },
  {
    id: "univ-nzerekore",
    name: "Universite de N'Zerekore",
    shortName: "UZ",
    sector: "public",
    kind: "universite",
    city: "N'Zerekore",
    description:
      "Universite publique creee en 2001, formation des etudiants de la region forestiere. Enseignement principalement en francais.",
    filieres: [
      "Genie de l'environnement",
      "Gestion des ressources naturelles",
      "Hydrologie",
      "Meteorologie",
      "Biologie",
      "Chimie",
      "Mathematiques",
      "Physique",
    ],
    website: "https://ent.univ-nzerekore.net/",
  },
  {
    id: "isav-faranah",
    name: "Institut Superieur Agronomique et Veterinaire de Faranah",
    shortName: "ISAV Faranah",
    sector: "public",
    kind: "institut",
    city: "Faranah",
    description:
      "Etablissement public fonde en 1978, specialise dans les sciences agronomiques, l'elevage et les disciplines veterinaires.",
    filieres: [
      "Agriculture",
      "Agroforesterie",
      "Eaux et forets environnement",
      "Sciences animales",
      "Genie rural",
      "Gestion des entreprises",
      "Economie Agricole",
      "Economie Rurale",
      "Vulgarisation agricole",
    ],
  },
  {
    id: "ismgb-boke",
    name: "Institut Superieur des Mines et Geologie de Boke",
    shortName: "ISMGB",
    sector: "public",
    kind: "institut",
    city: "Boke",
    description:
      "Etablissement public specialise dans les sciences de la Terre, les mines et l'ingenierie, en lien avec le secteur minier guineen.",
    filieres: [
      "Environnement et Securite industrielle",
      "Services Geologiques",
      "Services Miniers",
      "Traitement et Metallurgie",
    ],
    website: "https://ismgb.net/",
  },
  {
    id: "ist-mamou",
    name: "Institut Superieur de Technologie de Mamou",
    shortName: "IST-Mamou",
    sector: "public",
    kind: "institut",
    city: "Mamou",
    description:
      "Etablissement public cree en 2004, specialise dans les formations techniques et technologiques. Pôle de formation d'ingenieurs.",
    filieres: [
      "Genie Informatique",
      "Energetique",
      "Instrumentation et Mesures Physiques",
      "Techniques de Laboratoire",
    ],
    website: "https://www.ist-mamou.org/",
  },
  {
    id: "ukag",
    name: "Universite Kofi Annan de Guinee",
    shortName: "UKAG",
    sector: "prive",
    kind: "universite",
    city: "Conakry",
    description:
      "Universite privee pluridisciplinaire fondee en 1999. Formations du BTS au doctorat dans plusieurs disciplines.",
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
      "Genie logiciel",
      "Reseaux et Systemes",
      "Medecine",
      "Pharmacie",
      "Odontologie",
      "Genie Civil",
      "Genie Minier",
      "Architecture",
      "Genie Electrique",
      "Genie Informatique",
      "Logistique et Transport",
      "Tourisme et Hotellerie",
    ],
    website: "https://ukaguinee.org/Accueil",
  },
  {
    id: "unc",
    name: "Universite de Nongo Conakry",
    shortName: "UNC",
    sector: "prive",
    kind: "universite",
    city: "Conakry",
    description:
      "Universite privee de Conakry proposant des formations en genie, sciences economiques, juridiques et sociales.",
    filieres: [
      "Genie Informatique et telecommunications",
      "MIAGE",
      "Genie Electronique",
      "Genie civil",
      "Genie mineral",
      "Economie",
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
    name: "Universite Mercure International",
    shortName: "UMI",
    sector: "prive",
    kind: "universite",
    city: "Conakry",
    description:
      "Universite privee a Conakry, approche professionnalisante et partenariats academiques.",
    filieres: [
      "Genie informatique",
      "Genie Reseaux",
      "Genie logiciels",
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
    for (const filiere of inst.filieres) {
      const norm = normalizeText(filiere);
      const words = norm.split(/\s+/).filter((w) => w.length > 3);
      for (const word of words) {
        if (lower.includes(word)) score += 2;
      }
    }
    if (lower.includes(normalizeText(inst.city))) score += 3;
    if (lower.includes(normalizeText(inst.shortName))) score += 5;
    if (lower.includes("medecin") || lower.includes("pharmacie")) {
      if (inst.filieres.some((f) => /medecine|pharmacie|odontologie/i.test(f))) score += 4;
    }
    if (lower.includes("informatique") || lower.includes("info")) {
      if (inst.filieres.some((f) => /informatique|logiciel|miage|reseau/i.test(f))) score += 4;
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
    return `- **${inst.shortName}** (${inst.city}, ${inst.sector === "public" ? "public" : "prive"}) : ${filieresPreview}${extra}${web}`;
  });

  return `## Referentiel etablissements Guinee (source BacheliO — cite uniquement si pertinent)
${list.join("\n")}

Regles :
- Recommande 1 a 2 etablissements maximum quand l'etudiant demande ou etudier.
- Precise la ville et si l'etablissement est public ou prive.
- Pour la liste complete : [Universites & Ecoles](/universites)
- Ne cite pas d'etablissement hors de ce referentiel sauf si l'etudiant en parle deja.`;
}

export function formatInstitutionFilieres(inst: Institution, max = 6): string {
  const shown = inst.filieres.slice(0, max);
  const rest = inst.filieres.length - shown.length;
  return rest > 0 ? `${shown.join(", ")} (+${rest})` : shown.join(", ");
}
