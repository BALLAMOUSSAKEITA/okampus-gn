import OpenAI from "openai";

const VALID_MODELS = new Set(["deepseek-chat", "deepseek-reasoner"]);

function shouldSkipSslVerify() {
  if (process.env.NODE_ENV === "production") return false;
  return (
    process.env.DEEPSEEK_INSECURE_SSL === "true" ||
    (process.env.NODE_ENV === "development" && process.platform === "win32")
  );
}

function createInsecureFetch(): typeof fetch {
  return async (url, init) => {
    const previous = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
      return await fetch(url, init);
    } finally {
      if (previous === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = previous;
      }
    }
  };
}

export function getDeepSeekClient(forceInsecureSsl = false) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const allowInsecure = process.env.NODE_ENV !== "production";
  const useInsecure = allowInsecure && (forceInsecureSsl || shouldSkipSslVerify());

  return new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com",
    ...(useInsecure ? { fetch: createInsecureFetch() } : {}),
  });
}

export function getDeepSeekModel() {
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
  return VALID_MODELS.has(model) ? model : "deepseek-chat";
}

function isSslOrNetworkError(message: string): boolean {
  return (
    message.includes("UNABLE_TO_VERIFY") ||
    message.includes("certificate") ||
    message.includes("SSL") ||
    message.includes("fetch failed") ||
    message.includes("ECONNRESET") ||
    message.includes("ETIMEDOUT")
  );
}

export async function createDeepSeekCompletion(
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
) {
  const client = getDeepSeekClient();
  if (!client) {
    throw new Error("DEEPSEEK_UNAVAILABLE");
  }

  try {
    return await client.chat.completions.create(params);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      process.env.NODE_ENV !== "production" &&
      !shouldSkipSslVerify() &&
      isSslOrNetworkError(message)
    ) {
      const insecureClient = getDeepSeekClient(true);
      if (insecureClient) {
        return await insecureClient.chat.completions.create(params);
      }
    }
    throw error;
  }
}
