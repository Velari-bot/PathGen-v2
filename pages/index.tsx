import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const HomePage: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Removed auto-redirect - let users stay on the landing page
  }, [session, router])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Simple Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            PathGen
          </div>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/G8ph5P9HAw" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Discord
            </a>
            {session ? (
              <button
                onClick={() => router.push('/confirmation')}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              >
                View Confirmation
              </button>
            ) : (
              <button
                onClick={() => signIn('discord', { callbackUrl: '/confirmation' })}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Join Beta
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-full px-4 py-2 text-sm text-gray-400 mb-8">
            🎮 Join other players on the waitlist
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            Become a Better Fortnite Player<br />
            <span className="text-[#5865F2]">
              Faster.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            AI coaching, custom dropmaps, and system-level FPS tuning. Join the beta and get early access to PathGen+.
          </p>
          
          {/* CTA */}
          <div className="flex justify-center max-w-md mx-auto mb-8">
            <button
              onClick={() => signIn('discord', { callbackUrl: '/confirmation' })}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-12 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Sign Up with Discord
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            No spam. We'll only use this to send beta invites and product updates.
          </p>
        </div>
      </section>

      {/* Value Bullets */}
      <section className="py-20 px-6 bg-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              What PathGen Does
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🧠',
                title: 'AI Coach',
                description: 'Personalized improvement plans from your replays'
              },
              {
                icon: '🗺️',
                title: 'Smart Dropmaps',
                description: 'AI-generated drop paths based on your playstyle'
              },
              {
                icon: '⚙️',
                title: 'PC Optimizer',
                description: 'System-level FPS tuning and latency reduction'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#0a0a0f] rounded-xl p-6 border border-gray-800 text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Matches',
                description: 'Drag & drop your Fortnite replays or auto-sync'
              },
              {
                step: '2',
                title: 'Get AI Plan',
                description: 'Receive personalized drills and improvement tips'
              },
              {
                step: '3',
                title: 'Train & Improve',
                description: 'Practice smarter and see real results'
              }
            ].map((step, i) => (
              <div
                key={i}
                className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800"
              >
                <div className="text-4xl mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to level up?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the beta and get early access to PathGen+
          </p>
          <button
            onClick={() => signIn('discord', { callbackUrl: '/confirmation' })}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-12 py-5 rounded-lg font-bold text-xl hover:scale-105 transition-all inline-flex items-center gap-3"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Sign Up with Discord
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                PathGen
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered Fortnite coaching and analytics platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-white">Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/features" className="hover:text-[#5865F2] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/G8ph5P9HAw" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://x.com/PathGenNews" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors">
                    Twitter / X
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-[#5865F2] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#5865F2] transition-colors">Terms of Service</a></li>
                <li>
                  <a href="mailto:support@lunery.xyz" className="hover:text-[#5865F2] transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 PathGen. Built by <a href="https://lunery.xyz" className="text-[#5865F2] hover:underline">Lunery Dev Studio</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

