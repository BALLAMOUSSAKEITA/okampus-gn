import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  buildQuotaExceededMessage,
  type AssistantMode,
} from "@/lib/assistant-quota";
import { consumeAssistantQuota } from "@/lib/assistant-quota-server";
import { generateChatFallback } from "@/lib/chat-fallback";
import { createDeepSeekCompletion, getDeepSeekClient, getDeepSeekModel } from "@/lib/deepseek";
import {
  generateOrientationAdvice,
  type OrientationProfile,
} from "@/lib/orientation-fallback";
import { buildProfileContext, SYSTEM_PROMPT } from "@/lib/assistant-prompt";
import { formatAssistantReply } from "@/lib/assistant-format";
import { checkAssistantRateLimit } from "@/lib/rate-limit";
import { buildUniversitiesContextForAI } from "@/lib/universities";

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
  content: z.string().min(1).max(4000),
});

const requestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("orientation"),
    profile: profileSchema,
  }),
  z.object({
    mode: z.literal("chat"),
    profile: profileSchema,
    messages: z.array(messageSchema).min(1).max(50),
  }),
]);

function getLastUserMessage(messages: Array<{ role: string; content: string }>): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkAssistantRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessaie dans quelques minutes." },
        { status: 429 }
      );
    }

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
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const mode: AssistantMode = parsed.data.mode;

    let quota;
    try {
      quota = await consumeAssistantQuota(mode);
    } catch (quotaError) {
      console.error("[assistant] quota check failed", quotaError);
      return NextResponse.json(
        { error: "Impossible de vérifier ton quota d'utilisation" },
        { status: 503 }
      );
    }

    if (!quota.allowed && quota.limit != null) {
      return NextResponse.json(
        {
          content: buildQuotaExceededMessage(mode, quota.limit),
          quotaExceeded: true,
          limit: quota.limit,
          used: quota.used,
          remaining: 0,
          mode,
        },
        { status: 429 }
      );
    }

    const { profile } = parsed.data;
    const client = getDeepSeekClient();
    const lastUserMessage =
      parsed.data.mode === "chat" ? getLastUserMessage(parsed.data.messages) : "";
    const universitiesContext = buildUniversitiesContextForAI(lastUserMessage || undefined);
    const firstName = session.user.name?.split(" ")[0];
    const studentContext = firstName
      ? `\n\nPrénom de l'étudiant : ${firstName}. Utilise-le avec parcimonie dans tes réponses.`
      : "";
    const systemWithUniversities = `${SYSTEM_PROMPT}${studentContext}\n\n${universitiesContext}`;

    if (!client) {
      const fallback =
        parsed.data.mode === "orientation"
          ? generateOrientationAdvice(profile)
          : generateChatFallback(getLastUserMessage(parsed.data.messages));

      return NextResponse.json({
        content: fallback,
        fallback: true,
      });
    }

    try {
      if (parsed.data.mode === "orientation") {
        const completion = await createDeepSeekCompletion({
          model: getDeepSeekModel(),
          temperature: 0.4,
          max_tokens: 320,
          messages: [
            { role: "system", content: systemWithUniversities },
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
        if (!content) throw new Error("Réponse vide");

        return NextResponse.json({
          content,
          fallback: false,
          remaining: quota.remaining,
          unlimited: quota.unlimited,
        });
      }

      const chatMessages = parsed.data.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const completion = await createDeepSeekCompletion({
        model: getDeepSeekModel(),
        temperature: 0.5,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `${systemWithUniversities}\n\n${buildProfileContext(profile)}`,
          },
          ...chatMessages,
        ],
      });

      const content = formatAssistantReply(
        completion.choices[0]?.message?.content?.trim() || ""
      );
      if (!content) throw new Error("Réponse vide");

      return NextResponse.json({
        content,
        fallback: false,
        remaining: quota.remaining,
        unlimited: quota.unlimited,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur DeepSeek";
      console.error("[assistant]", message, error);
      const isLowBalance =
        message.includes("Insufficient Balance") || message.includes("402");

      if (parsed.data.mode === "orientation") {
        const intro = isLowBalance
          ? "Analyse de secours :\n\n"
          : "";

        return NextResponse.json({
          content: `${intro}${generateOrientationAdvice(profile)}`,
          fallback: true,
        });
      }

      const lastUser = getLastUserMessage(parsed.data.messages);

      return NextResponse.json({
        content: generateChatFallback(lastUser),
        fallback: true,
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
