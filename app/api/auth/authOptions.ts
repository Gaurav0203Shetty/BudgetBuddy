// app/api/auth/authOptions.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.username && credentials?.password) {
            // Return a user object with id and name
            return { id: Date.now().toString(), name: credentials.username }
          }
        } catch (error) {
          console.error("Error in authorize:", error)
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  // For debugging, you can temporarily hard-code the secret:
  secret: process.env.NEXTAUTH_SECRET || "secret", // Ensure this is consistent
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        console.log("JWT callback - new user:", user.id)
      }
      console.log("JWT token after callback:", token)
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        console.log("Session callback - session.user:", session.user)
      }
      return session
    },
  },
  debug: true,
}
