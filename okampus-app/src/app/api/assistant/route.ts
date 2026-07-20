import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getDeepSeekClient, getDeepSeekModel } from "@/lib/deepseek";
import {
  generateOrientationAdvice,
  type OrientationProfile,
} from "@/lib/orientation-fallback";
import { formatAssistantReply } from "@/lib/assistant-format";

const profileSchema = z.object({
  projectEtudes: z.string(),
  forces: z.string(),
  faiblesses: z.string(),
  notes: z.string(),
  serieBac: z.string(),
  passions: z.string(),
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const requestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("orientation"),
    profile: profileSchema,
  }),
  z.object({
    mode: z.literal("chat"),
    profile: profileSchema,
    messages: z.array(messageSchema).min(1),
  }),
]);

const SYSTEM_PROMPT = `Tu es Kampus, l'assistant IA d'orientation d'O'Kampus (Guinee).

Comportement :
- Conversation naturelle en francais, ton bienveillant et concret.
- Ne repete pas de salutation : l'etudiant a deja recu un message d'accueil.
- Pose UNE seule question a la fois pour comprendre : projet d'etudes, serie au bac, notes, centres d'interet.
- Reponses courtes : 2 a 4 phrases tant que tu collectes des informations.
- Quand tu as assez d'elements pour recommander, utilise ce format (100 mots max) :

## Filières
- (2 filieres max)

## Conseils
- (2 conseils max)

## Suite
1. (1 action : lien mentor, forum, ou question de suivi)

Liens (OBLIGATOIRE quand tu parles de mentorat ou forum) :
- Mentor : [Clique ici pour contacter un mentor](/conseil)
- Forum : [Poser ma question sur le forum](/forum)
- N'ecris jamais "/conseil" ou "/forum" en texte brut : utilise toujours le format markdown [texte](url).

- N'invente pas de notes ou de faits non mentionnes dans la conversation.
- Mentionne UGANC, IPG, Gamal ou Kofi Annan seulement si pertinent.
- Si l'etudiant accepte d'etre mis en relation avec un mentor, reponds en 2-3 phrases max avec le lien mentor ci-dessus.`;

function buildProfileContext(profile: OrientationProfile): string {
  const hasData = Object.values(profile).some((v) => v.trim());
  if (!hasData) {
    return "Profil etudiant : a construire au fil de la conversation (pas de formulaire).";
  }
  return `Profil etudiant (partiel) :
- Projet d'etudes : ${profile.projectEtudes || "Non precise"}
- Serie au bac : ${profile.serieBac || "Non precise"}
- Notes : ${profile.notes || "Non precisees"}
- Forces : ${profile.forces || "Non precisees"}
- Points a ameliorer : ${profile.faiblesses || "Non precises"}
- Centres d'interet : ${profile.passions || "Non precises"}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Connecte-toi pour utiliser l'assistant IA" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
    }

    const { profile } = parsed.data;
    const client = getDeepSeekClient();

    if (!client) {
      const fallback =
        parsed.data.mode === "orientation"
          ? generateOrientationAdvice(profile)
          : "Service IA indisponible. Consulte /conseil ou le forum.";

      return NextResponse.json({ content: fallback, fallback: true });
    }

    try {
      if (parsed.data.mode === "orientation") {
        const completion = await client.chat.completions.create({
          model: getDeepSeekModel(),
          temperature: 0.4,
          max_tokens: 280,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `${buildProfileContext(profile)}

Analyse ce profil. Respecte le format et la limite de 100 mots.`,
            },
          ],
        });

        const content = formatAssistantReply(
          completion.choices[0]?.message?.content?.trim() || ""
        );
        if (!content) throw new Error("Reponse vide");

        return NextResponse.json({
          content,
          fallback: false,
        });
      }

      const completion = await client.chat.completions.create({
        model: getDeepSeekModel(),
        temperature: 0.5,
        max_tokens: 220,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n${buildProfileContext(profile)}` },
          ...parsed.data.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      });

      const content = formatAssistantReply(
        completion.choices[0]?.message?.content?.trim() || ""
      );
      if (!content) throw new Error("Reponse vide");

      return NextResponse.json({ content, fallback: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur DeepSeek";
      console.error("[assistant]", message, error);

      const isLowBalance =
        message.includes("Insufficient Balance") || message.includes("402");

      if (parsed.data.mode === "orientation") {
        const intro = isLowBalance
          ? "Credits DeepSeek epuises — analyse de secours :\n\n"
          : "";

        return NextResponse.json({
          content: `${intro}${generateOrientationAdvice(profile)}`,
          fallback: true,
          error: message,
        });
      }

      return NextResponse.json({
        content: "Reessaie dans un instant ou contacte un mentor sur /conseil.",
        fallback: true,
        error: message,
      });
    }
  } catch (error) {
    console.error("[assistant] unhandled", error);
    return NextResponse.json(
      { error: "Erreur interne de l'assistant" },
      { status: 500 }
    );
  }
}
