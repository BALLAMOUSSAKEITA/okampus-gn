import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { refreshTokenRole, ROLE_REFRESH_MS, SERVER_API_URL } from "@/lib/server-auth"

const PUBLIC_PATHS = ["/", "/inscription", "/connexion", "/confidentialite", "/offline"]

/** Pages consultables sans connexion (SEO, partage Facebook, découverte). */
const PUBLIC_PREFIXES = [
  "/bourses",
  "/actualites",
  "/forum",
  "/stages",
  "/conseil",
  "/assistant",
  "/ressources",
  "/success-stories",
  "/entrepreneuriat",
  "/universites",
  "/cv",
  "/calendrier",
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname === "/opengraph-image" || pathname === "/twitter-image") return true
  if (pathname.endsWith("/opengraph-image") || pathname.endsWith("/twitter-image")) return true
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email ou téléphone", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier =
          (typeof credentials?.identifier === "string" && credentials.identifier.trim()) ||
          (typeof credentials?.email === "string" && credentials.email.trim()) ||
          ""
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""
        if (!identifier || !password) return null

        try {
          const res = await fetch(`${SERVER_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
          })

          if (!res.ok) return null

          const data = await res.json()

          return {
            id: data.user.id,
            email: data.user.email || data.user.phone || identifier,
            name: data.user.name,
            role: data.user.role,
            accèssToken: data.accèss_token,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl

      if (pathname.startsWith("/api/auth")) return true
      if (pathname.startsWith("/api/backend")) return true
      if (pathname.startsWith("/api/assistant")) return true
      if (pathname.startsWith("/api/og")) return true
      if (isPublicPath(pathname)) return true

      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "admin"
      }

      return !!auth?.user
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accèssToken = user.accèssToken
        token.roleCheckedAt = Date.now()
        return token
      }

      const checkedAt =
        typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0
      const shouldRefresh =
        trigger === "update" || Date.now() - checkedAt > ROLE_REFRESH_MS

      if (shouldRefresh && token.accèssToken) {
        return (await refreshTokenRole(token as Record<string, unknown>)) as typeof token
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 15 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
})
