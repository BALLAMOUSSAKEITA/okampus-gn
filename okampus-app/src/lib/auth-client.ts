import { signIn } from "next-auth/react";

type SignInResult = {
  ok: boolean;
  error?: string;
};

/**
 * Connexion credentials puis redirection pleine page
 * (evite de rester sur /connexion quand le middleware
 * ne voit pas encore la session après un router.push).
 */
export async function signInWithRedirect(
  identifier: string,
  password: string,
  callbackUrl: string
): Promise<SignInResult> {
  const res = await signIn("credentials", {
    identifier,
    password,
    redirect: false,
    callbackUrl,
  });

  if (!res || res.error || res.ok !== true) {
    return {
      ok: false,
      error: "Identifiant ou mot de passe incorrect",
    };
  }

  window.location.assign(res.url || callbackUrl);
  return { ok: true };
}
