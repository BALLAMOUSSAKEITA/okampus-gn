import OpenAI from "openai";

const VALID_MODELS = new Set(["deepseek-chat", "deepseek-reasoner"]);

function shouldSkipSslVerify() {
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

export function getDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com",
    ...(shouldSkipSslVerify() ? { fetch: createInsecureFetch() } : {}),
  });
}

export function getDeepSeekModel() {
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";
  return VALID_MODELS.has(model) ? model : "deepseek-chat";
}
