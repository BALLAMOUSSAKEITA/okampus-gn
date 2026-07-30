/** Detecte et normalise email ou téléphone guinéen. */

export function looksLikeEmail(value: string): boolean {
  return value.trim().includes("@");
}

export function normalizePhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("00224")) digits = digits.slice(5);
  else if (digits.startsWith("224")) digits = digits.slice(3);
  else if (digits.startsWith("0") && digits.length === 10) digits = digits.slice(1);

  if (digits.length !== 9 || !/^[67]/.test(digits)) return null;
  return `+224${digits}`;
}

export function parseContactIdentifier(raw: string): {
  email?: string;
  phone?: string;
  error?: string;
} {
  const value = raw.trim();
  if (!value) return { error: "Email ou téléphone requis" };

  if (looksLikeEmail(value)) {
    const email = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Email invalide" };
    }
    return { email };
  }

  const phone = normalizePhone(value);
  if (!phone) {
    return { error: "Numéro invalide (ex: 620123456 ou +224620123456)" };
  }
  return { phone };
}
