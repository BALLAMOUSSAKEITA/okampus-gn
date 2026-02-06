import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { CvProfile } from "@/types";

export const runtime = "nodejs";

type GenerateCvRequest = {
  name: string;
  email: string;
  roleLabel?: string;
  cvProfile: CvProfile;
};

function profileToPrompt(input: GenerateCvRequest) {
  const { name, email, roleLabel, cvProfile } = input;
  const safe = (v?: string) => (v && v.trim().length > 0 ? v.trim() : "—");

  return `
Tu es un expert RH. Génère un CV **professionnel en français**, adapté au contexte guinéen.
Format de sortie: **Markdown** uniquement (pas de JSON).
Contraintes:
- 1 page idéalement (donc concis)
- Verbes d'action, résultats mesurables si possible
- Pas d'informations inventées (si donnée absente, ne pas l'ajouter)
- Ne pas inclure de photo

## Identité
- Nom: ${safe(name)}
- Email: ${safe(email)}
- Téléphone: ${safe(cvProfile.phone)}
- Localisation: ${safe(cvProfile.location)}
- Titre/Headline: ${safe(cvProfile.headline)}
- Statut: ${safe(roleLabel)}

## À propos
${safe(cvProfile.about)}

## Compétences (liste brute)
${(cvProfile.skills || []).map((s) => `- ${s}`).join("\n") || "—"}

## Langues (liste brute)
${(cvProfile.languages || []).map((l) => `- ${l}`).join("\n") || "—"}

## Formation
${(cvProfile.education || [])
  .map(
    (e) =>
      `- ${e.degree} — ${e.school} (${safe(e.startYear)} - ${safe(e.endYear)})${
        e.details ? `\n  - ${e.details}` : ""
      }`
  )
  .join("\n") || "—"}

## Expériences
${(cvProfile.experiences || [])
  .map(
    (x) =>
      `- ${x.title} — ${x.company}${x.location ? `, ${x.location}` : ""} (${safe(
        x.start
      )} - ${_classicEnd(x.end)})\n${(x.bullets || [])
        .filter(Boolean)
        .map((b) => `  - ${b}`)
        .join("\n")}`
  )
  .join("\n\n") || "—"}

## Projets
${(cvProfile.projects || [])
  .map(
    (p) =>
      `- ${p.name}${p.link ? ` (${p.link})` : ""}${
        p.description ? `\n  - ${p.description}` : ""
      }\n${(p.bullets || [])
        .filter(Boolean)
        .map((b) => `  - ${b}`)
        .join("\n")}`
  )
  .join("\n\n") || "—"}
`;
}

function _classicEnd(end?: string) {
  if (!end) return "Présent";
  const t = end.trim();
  return t.length ? t : "Présent";
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquant. Ajoute-le dans .env.local" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as GenerateCvRequest;
    if (!body?.name || !body?.email || !body?.cvProfile) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = profileToPrompt(body);
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es un assistant RH. Tu produis des CV clairs, modernes, et honnêtes. Tu n'inventes rien.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    if (!content) {
      return NextResponse.json(
        { error: "Réponse vide du modèle" },
        { status: 502 }
      );
    }

    return NextResponse.json({ markdown: content });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur inconnue lors de la génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

