import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const TermsPage: NextPage = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Effective Date: 12/8/2025</p>

          <p className="text-gray-300 mb-6">
            These Terms of Service ("Terms") govern your use of PathGen ("Service") operated by PathGen ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-6">
            By accessing or using PathGen, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Description of Service</h2>
          <p className="text-gray-300 mb-4">PathGen is an AI-powered Fortnite improvement coaching platform that provides:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Personalized gaming advice and coaching</li>
            <li>Fortnite performance analysis and statistics</li>
            <li>AI-powered gameplay improvement suggestions</li>
            <li>Integration with third-party gaming APIs</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">3. User Accounts</h2>
          <p className="text-gray-300 mb-4">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Maintaining the security of your account and password</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring your account information is accurate and up-to-date</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">4. Acceptable Use</h2>
          <p className="text-gray-300 mb-4">You agree not to use the Service to:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Upload malicious code or attempt to gain unauthorized access</li>
            <li>Use the Service for commercial purposes without permission</li>
            <li>Attempt to reverse engineer or modify the Service</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">5. Privacy and Data</h2>
          <p className="text-gray-300 mb-6">
            Your privacy is important to us. Please review our <a href="/privacy" className="text-[#5865F2] hover:underline">Privacy Policy</a>, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">6. Third-Party Services</h2>
          <p className="text-gray-300 mb-4">Our Service may integrate with third-party services, including:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>Epic Games (for account authentication)</li>
            <li>Fortnite Tracker (for gaming statistics)</li>
            <li>OpenAI (for AI coaching features)</li>
          </ul>
          <p className="text-gray-300 mb-6">
            Your use of these third-party services is subject to their respective terms of service and privacy policies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">7. Intellectual Property</h2>
          <p className="text-gray-300 mb-6">
            The Service and its original content, features, and functionality are and will remain the exclusive property of PathGen and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">8. Disclaimers</h2>
          <p className="text-gray-300 mb-4">The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties:</p>
          <ul className="text-gray-300 mb-6 list-disc ml-6 space-y-2">
            <li>That the Service will meet your specific requirements</li>
            <li>That the Service will be uninterrupted or error-free</li>
            <li>That the results obtained from using the Service will be accurate or reliable</li>
            <li>That the quality of any products, services, or information obtained through the Service will meet your expectations</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">9. Limitation of Liability</h2>
          <p className="text-gray-300 mb-6">
            In no event shall PathGen, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">10. Termination</h2>
          <p className="text-gray-300 mb-6">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">11. Changes to Terms</h2>
          <p className="text-gray-300 mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">12. Governing Law</h2>
          <p className="text-gray-300 mb-6">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which PathGen operates, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">13. Contact Information</h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about these Terms of Service, please contact us at: <a href="mailto:support@lunery.xyz" className="text-[#5865F2] hover:underline">support@lunery.xyz</a>
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

export default TermsPage

