import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="mb-6">
            {session.user?.avatarUrl && (
              <img 
                src={session.user.avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full mb-4"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2">
              Welcome back, {session.user?.username}!
            </h2>
            {session.user?.email && (
              <p className="text-gray-400">{session.user.email}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Subscription Status</h3>
              <p className={`text-lg ${session.user?.subscriptionStatus ? 'text-green-400' : 'text-red-400'}`}>
                {session.user?.subscriptionStatus ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">User Info</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Discord ID:</span> {session.user?.discordId}</p>
                <p><span className="text-gray-400">Username:</span> {session.user?.username}</p>
                {session.user?.discriminator && (
                  <p><span className="text-gray-400">Discriminator:</span> {session.user.discriminator}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

