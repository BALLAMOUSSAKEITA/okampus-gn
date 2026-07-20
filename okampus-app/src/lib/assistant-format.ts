/** Nettoie et raccourcit le texte renvoye par le LLM. */
export function formatAssistantReply(raw: string): string {
  let text = raw.trim();

  text = text.replace(/^(bonjour[^\n!]*[!]?\s*\n+)+/gi, "");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = autoLinkInternalPaths(text);

  return text.trim();
}

function autoLinkInternalPaths(text: string): string {
  if (!text.includes("](/conseil)")) {
    text = text.replace(
      /\B\/conseil\b/g,
      "[Clique ici pour contacter un mentor](/conseil)"
    );
  }
  if (!text.includes("](/forum)")) {
    text = text.replace(
      /\B\/forum\b/g,
      "[Poser ma question sur le forum](/forum)"
    );
  }
  return text;
}

export function shortenFallbackReply(raw: string, maxLines = 14): string {
  const lines = raw.split("\n").filter((line) => line.trim());
  if (lines.length <= maxLines) return raw;
  return `${lines.slice(0, maxLines).join("\n")}\n\n…`;
}
