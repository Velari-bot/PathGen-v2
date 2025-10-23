import type { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Fortnite Coach</h1>
        <h2 className="text-2xl font-semibold mb-8">PathGen</h2>
        <a href="/login" className="bg-[#5865F2] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#4752C4] transition-colors inline-block">
          Get Started
        </a>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

