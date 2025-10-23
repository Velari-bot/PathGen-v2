import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Discord profile type
interface DiscordProfile {
  id: string
  username: string
  discriminator: string
  email?: string
  image_url?: string
}

// Debug logging
console.log('CLIENT ID:', process.env.DISCORD_CLIENT_ID)
console.log('CLIENT SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'SET' : 'NOT SET')
console.log('CLIENT SECRET LENGTH:', process.env.DISCORD_CLIENT_SECRET?.length)
console.log('CLIENT SECRET VALUE:', process.env.DISCORD_CLIENT_SECRET)
console.log('CLIENT SECRET TRIMMED:', process.env.DISCORD_CLIENT_SECRET?.trim())
console.log('CLIENT SECRET TRIMMED LENGTH:', process.env.DISCORD_CLIENT_SECRET?.trim().length)
console.log('NEXTAUTH SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET?.trim()!
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          const discordProfile = profile as DiscordProfile
          const discordId = discordProfile.id
          const username = discordProfile.username
          const discriminator = discordProfile.discriminator
          const avatar = discordProfile.image_url
          const email = discordProfile.email

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
            // Create new user - mark as early bird
            await setDoc(userRef, {
              discordId,
              username,
              discriminator: discriminator || null,
              avatarUrl: avatar || null,
              email: email || null,
              subscriptionStatus: false,
              earlyBird: true,
              earlyBirdPrice: 49.99,
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
        const discordProfile = profile as DiscordProfile
        token.sub = discordProfile.id
        // Check if this is a new user
        if (user) {
          token.isNewUser = true
        }
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // If coming from signin, redirect to confirmation for new users
      if (url === `${baseUrl}/api/auth/signin`) {
        return `${baseUrl}/confirmation`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
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

