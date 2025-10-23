import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

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

          const userRef = doc(db, 'users', discordId)
          const userDoc = await getDoc(userRef)

          if (userDoc.exists()) {
            // Update existing user
            await setDoc(userRef, {
              username,
              discriminator: discriminator || null,
              avatarUrl: avatar || null,
              email: email || null,
              updatedAt: new Date()
            }, { merge: true })
          } else {
            // Create new user
            await setDoc(userRef, {
              discordId,
              username,
              discriminator: discriminator || null,
              avatarUrl: avatar || null,
              email: email || null,
              subscriptionStatus: false,
              createdAt: new Date(),
              updatedAt: new Date()
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
        try {
          const userRef = doc(db, 'users', token.sub)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            session.user = {
              id: userDoc.id,
              discordId: userData.discordId,
              username: userData.username,
              discriminator: userData.discriminator,
              avatarUrl: userData.avatarUrl,
              email: userData.email,
              subscriptionStatus: userData.subscriptionStatus
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error)
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

