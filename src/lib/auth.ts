import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
    }),
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@chokhojeeman.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email || 'admin@chokhojeeman.com'
        let user = await prisma.user.findUnique({
          where: { email },
        })
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: 'Administrator',
              role: 'ADMIN',
            },
          })
        } else if (user.role !== 'ADMIN') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
          })
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'CUSTOMER'
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = (token.role as string) ?? 'CUSTOMER'
      }
      return session
    },
  },
}

export async function getAuthSession() {
  return getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getAuthSession()
  if (!session?.user) {
    return null
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  })

  if (!user || user.role !== 'ADMIN') return null
  return { session, user }
}
