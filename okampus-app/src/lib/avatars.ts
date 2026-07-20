export type AvatarGender = "male" | "female";

export const AVATAR_MALE = "/images/avatar-homme.png";
export const AVATAR_FEMALE = "/images/avatar-fille.png";

const FEMALE_FIRST_NAMES = new Set([
  "aissatou",
  "fatoumata",
  "mariama",
  "hadja",
  "kadiatou",
  "hawa",
  "aminata",
  "djene",
  "djenè",
  "salimata",
  "bintou",
  "maimouna",
  "rama",
  "khady",
  "fanta",
  "nana",
]);

const MALE_FIRST_NAMES = new Set([
  "mamadou",
  "ibrahima",
  "ibrahim",
  "ousmane",
  "alpha",
  "mohamed",
  "abdoulaye",
  "thierno",
  "sekou",
  "amadou",
  "lansana",
  "youssouf",
  "oumar",
  "sory",
  "billy",
  "moussa",
  "francois",
  "françois",
]);

function normalizeFirstName(name: string): string {
  return name
    .trim()
    .split(/\s+/)[0]
    .replace(/^dr\.?\s*/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function inferGenderFromName(name: string): AvatarGender {
  const first = normalizeFirstName(name);
  if (FEMALE_FIRST_NAMES.has(first)) return "female";
  if (MALE_FIRST_NAMES.has(first)) return "male";
  return first.endsWith("a") || first.endsWith("e") ? "female" : "male";
}

export function getAvatarSrc(gender: AvatarGender): string {
  return gender === "female" ? AVATAR_FEMALE : AVATAR_MALE;
}
