import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const HomePage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-xl">Redirecting...</div>
    </div>
  )
}

export default HomePage

