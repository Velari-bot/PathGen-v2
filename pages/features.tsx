import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const FeaturesPage: NextPage = () => {
  const router = useRouter()

  const features = [
    {
      category: 'Dashboard',
      items: [
        { name: 'User Dashboard', description: 'AI-tailored insights based on your previous games and weak areas', priority: 5 },
        { name: 'Performance Overview', description: 'AI generates personalized summary of your progression', priority: 5 },
        { name: 'Recent Games', description: 'AI highlights trend improvements or consistent mistakes', priority: 4 },
        { name: 'AI Insight of the Day', description: 'Daily personalized advice based on your last 10 matches', priority: 4 },
        { name: 'Team Overview', description: 'AI identifies team synergy and assigns improvement roles', priority: 4 }
      ]
    },
    {
      category: 'Replay Analysis',
      items: [
        { name: 'Replay Auto-Uploader', description: 'AI auto-tags and classifies replays for learning insights', priority: 5 },
        { name: 'Heatmap Generator', description: 'AI detects dangerous vs safe areas based on user and global data', priority: 5 },
        { name: 'Death Location Heatmap', description: 'AI compares your deaths with top players to suggest rotations', priority: 5 },
        { name: 'Landing Heatmap', description: 'AI recommends drop spots based on success rate', priority: 4 },
        { name: 'Surge Tag Heatmap', description: 'AI finds ideal surge-tag positions and patterns', priority: 4 },
        { name: 'Global Average Overlay', description: 'AI compares your movement and stats to top players', priority: 5 },
        { name: 'AI Pattern Finder', description: 'AI finds consistent patterns like dying off spawn or poor storm rotations', priority: 5 }
      ]
    },
    {
      category: 'Map Tools',
      items: [
        { name: 'Bus Calculator', description: 'AI predicts best drop timing and glide path', priority: 5 },
        { name: 'Drop Map Generator', description: 'AI generates optimal drop routes based on loot density and safety', priority: 5 },
        { name: 'POI/Area Data Viewer', description: 'AI identifies which POIs match your playstyle', priority: 4 },
        { name: 'Zone Rating Map', description: 'AI assigns survival, loot, and metal ratings to areas', priority: 4 }
      ]
    },
    {
      category: 'AI Coaching',
      items: [
        { name: 'Personalized AI Coach', description: 'AI trains personalized improvement plans', priority: 5 },
        { name: 'Video Breakdown', description: 'AI generates timestamped feedback like a coach', priority: 5 },
        { name: 'Drill Generator', description: 'AI creates practice drills for building, aim, and rotation', priority: 4 },
        { name: 'Performance Rating System', description: 'AI scores users 0–100 and tracks over time', priority: 4 },
        { name: 'Drill & Practice Planner', description: 'AI creates customized practice routines', priority: 5 },
        { name: 'AI Commentator', description: 'AI gives dynamic spoken feedback', priority: 4 },
        { name: 'Mental & Focus Coach', description: 'AI tracks frustration dips or tilt trends and suggests breaks', priority: 3 }
      ]
    },
    {
      category: 'Weapons & Meta',
      items: [
        { name: 'Weapon Comparison Tool', description: 'AI evaluates optimal choices per game phase', priority: 5 },
        { name: 'Loadout Builder', description: 'AI rates team synergy and balance', priority: 4 },
        { name: 'Meta Change Monitor', description: 'AI tracks weapon meta and trend forecasts', priority: 5 },
        { name: 'Patch History Visualizer', description: 'AI summarizes meta shifts and predicts upcoming trends', priority: 3 }
      ]
    },
    {
      category: 'Hardware Optimization',
      items: [
        { name: 'Performance Optimizer', description: 'AI finds bottlenecks and suggests PC tweaks', priority: 5 },
        { name: 'Gear Comparison Tool', description: 'AI recommends best gear per budget', priority: 3 },
        { name: 'Certified Gear List', description: 'AI updates with top pro gear trends', priority: 2 }
      ]
    },
    {
      category: 'Esports & Competitive',
      items: [
        { name: 'Scrim Analyzer', description: 'AI compares scrim results and identifies weak rotations', priority: 4 },
        { name: 'Synergy Rating System', description: 'AI builds a chemistry index for squads', priority: 4 },
        { name: 'Tournament Prep Mode', description: 'AI builds strategy sheets based on meta trends', priority: 5 }
      ]
    }
  ]

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white">
              PathGen Features
            </h1>
            <p className="text-xl text-gray-400">
              AI-powered tools to help you become a better Fortnite player
            </p>
          </div>

          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-[#5865F2] border-b border-gray-800 pb-3">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800 hover:border-[#5865F2]/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      {item.priority >= 5 && (
                        <span className="bg-[#5865F2] text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Core
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

export default FeaturesPage

