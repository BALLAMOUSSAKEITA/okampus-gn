import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.API_URL ?? "http://localhost:8000"

const PUBLIC_PATHS = ["/", "/inscription", "/connexion", "/confidentialite", "/offline"]

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email ou telephone", type: "text" },
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
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier,
              password,
            }),
          })

          if (!res.ok) return null

          const data = await res.json()

          return {
            id: data.user.id,
            email: data.user.email || data.user.phone || identifier,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.access_token,
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
      if (pathname.startsWith("/api/")) return true
      if (PUBLIC_PATHS.includes(pathname)) return true

      if (pathname.startsWith("/admin")) {
        return !!auth?.user
      }

      return !!auth?.user
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 90 * 24 * 60 * 60,
  },
})
