import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ConfirmationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEarlyBird, setIsEarlyBird] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    
    // Check if user signed up before Jan 1, 2026
    const cutoffDate = new Date('2026-01-01')
    const now = new Date()
    setIsEarlyBird(now < cutoffDate)
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold mb-6 text-white">
          You're in!
        </h1>

        {/* Early Bird Message */}
        {isEarlyBird ? (
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-300">
              Your early-bird price of <span className="text-white font-bold">$49.99</span> is locked in forever!
            </p>
            <p className="text-lg text-gray-400">
              Pay once, access forever. No monthly fees. Versus waiting and paying $6.99 a month.
            </p>
            <p className="text-sm text-gray-500">
              We're currently seeking sign-ups to help us continue forward with development. We'll email you at <span className="text-white">support@lunery.xyz</span> when we launch.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-300">
              Thanks for signing up!
            </p>
            <p className="text-lg text-gray-400">
              We'll email you at <span className="text-white">support@lunery.xyz</span> when we launch.
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-600 mb-4">
          Made with ❤️ by PathGen Team
        </p>
        
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-white transition-colors text-sm underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

