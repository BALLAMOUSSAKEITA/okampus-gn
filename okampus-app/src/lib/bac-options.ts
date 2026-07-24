/** Séries du baccalauréat guinéen (unique référence partagée). */
export const BAC_OPTIONS = [
  "Sciences Mathématiques",
  "Sciences Expérimentales",
  "Sciences Sociales",
] as const;

export type BacOption = (typeof BAC_OPTIONS)[number];

export function normalizeBacSerie(serie: string): "sm" | "se" | "ss" | "unknown" {
  const s = serie
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (s.includes("mathemat") || /\bsm\b/.test(s)) return "sm";
  if (s.includes("experiment") || /\bse\b/.test(s)) return "se";
  if (s.includes("social") || /\bss\b/.test(s)) return "ss";
  return "unknown";
}
