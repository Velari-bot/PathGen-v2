import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          const discordId = profile.id as string
          const username = profile.username as string
          const discriminator = profile.discriminator as string
          const avatar = profile.image_url as string | undefined
          const email = profile.email as string | undefined

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { discordId }
          })

          if (existingUser) {
            // Update existing user
            await prisma.user.update({
              where: { discordId },
              data: {
                username,
                discriminator: discriminator || null,
                avatarUrl: avatar || null,
                email: email || null,
                updatedAt: new Date()
              }
            })
          } else {
            // Create new user
            await prisma.user.create({
              data: {
                discordId,
                username,
                discriminator: discriminator || null,
                avatarUrl: avatar || null,
                email: email || null,
                subscriptionStatus: false
              }
            })
          }

          return true
        } catch (error) {
          console.error('Error saving user:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { discordId: token.sub }
        })
        
        if (user) {
          session.user = {
            id: user.id,
            discordId: user.discordId,
            username: user.username,
            discriminator: user.discriminator,
            avatarUrl: user.avatarUrl,
            email: user.email,
            subscriptionStatus: user.subscriptionStatus
          }
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        token.sub = profile.id as string
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)

