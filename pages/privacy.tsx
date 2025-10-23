import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const PrivacyPage: NextPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => router.push('/')}>
              PathGen
            </div>
            <a href="https://discord.gg/G8ph5P9HAw" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Discord
            </a>
            <a href="https://x.com/PathGenNews" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              X
            </a>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Effective Date: 12/8/2025</p>

          <p className="text-gray-300 mb-6">
            PathGen ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, application, and related services (collectively, the "Service").
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. Information We Collect</h2>
          <p className="text-gray-300 mb-4">We may collect the following types of information when you use PathGen:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li><strong>Account Information:</strong> Username, email address, password, and linked gaming accounts (e.g., Fortnite Tracker, Epic Games).</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent in the app, and other analytical data.</li>
            <li><strong>Gameplay Data:</strong> Game statistics, match history, and performance metrics obtained via APIs you authorize.</li>
            <li><strong>Device & Technical Data:</strong> IP address, browser type, operating system, and device identifiers.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">We use the collected information to:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Provide, maintain, and improve our Service.</li>
            <li>Personalize user experiences and game insights.</li>
            <li>Connect with third-party APIs to fetch and display your stats.</li>
            <li>Process payments (if applicable).</li>
            <li>Detect and prevent fraud or misuse.</li>
            <li>Communicate with you about updates, offers, or support.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">3. Sharing Your Information</h2>
          <p className="text-gray-300 mb-4">We do not sell your personal data. We may share your information only in these cases:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>With your consent (e.g., linking a gaming account).</li>
            <li>With service providers who help operate our platform (e.g., hosting, analytics, payment processing).</li>
            <li>For legal reasons if required by law, court order, or to protect rights and safety.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">4. Data Retention</h2>
          <p className="text-gray-300 mb-6">
            We retain your information as long as your account is active or as needed to provide the Service. You may request deletion at any time by contacting us at support@lunery.xyz.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">5. Your Rights</h2>
          <p className="text-gray-300 mb-4">Depending on your location, you may have the right to:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Access, update, or delete your personal data.</li>
            <li>Withdraw consent to data processing.</li>
            <li>Request a copy of your stored data.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">6. Security</h2>
          <p className="text-gray-300 mb-6">
            We use industry-standard encryption and security measures to protect your data. However, no method of transmission or storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">7. Third-Party Services</h2>
          <p className="text-gray-300 mb-6">
            PathGen may integrate with third-party APIs (e.g., Fortnite Tracker) to fetch game-related data. Your use of these features is subject to the third-party's privacy policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">8. Children's Privacy</h2>
          <p className="text-gray-300 mb-6">
            Our Service is not directed to anyone under the age of 13. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">9. Changes to This Policy</h2>
          <p className="text-gray-300 mb-6">
            We may update this Privacy Policy from time to time. Changes will be posted here with an updated effective date.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">10. Contact Us</h2>
          <p className="text-gray-300 mb-6">
            If you have questions about this Privacy Policy, contact us at: <a href="mailto:support@lunery.xyz" className="text-[#5865F2] hover:underline">support@lunery.xyz</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 PathGen. Built by <a href="https://lunery.xyz" className="text-[#5865F2] hover:underline">Lunery Dev Studio</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPage

