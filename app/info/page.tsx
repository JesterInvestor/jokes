'use client'

export default function Info() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-green animate-pulse-glow">
          ℹ️ INFO ℹ️
        </h1>
        <p className="text-fluorescent-orange text-lg">
          Everything you need to know about Jokes
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* About Section */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-cyan/30 rounded-2xl p-6 hover:border-fluorescent-cyan transition-all duration-300">
          <h2 className="text-2xl font-bold text-fluorescent-cyan mb-4 flex items-center gap-2">
            <span>😄</span>
            <span>About Jokes</span>
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Jokes is a Farcaster miniapp where you can share your funniest jokes, vote on others, 
            and compete for the top spot on the leaderboard. Our vibrant, fluorescent-themed 
            interface brings fun and laughter to the Farcaster ecosystem!
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-purple/30 rounded-2xl p-6 hover:border-fluorescent-purple transition-all duration-300">
          <h2 className="text-2xl font-bold text-fluorescent-purple mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>How It Works</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h3 className="text-white font-bold mb-1">Connect Your Wallet</h3>
                <p className="text-gray-300 text-sm">
                  Use Farcaster Wallet, MetaMask, Coinbase Wallet, or WalletConnect to get started.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h3 className="text-white font-bold mb-1">Share Your Jokes</h3>
                <p className="text-gray-300 text-sm">
                  Head to the Write tab and submit your funniest jokes for the community to enjoy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h3 className="text-white font-bold mb-1">Vote & Engage</h3>
                <p className="text-gray-300 text-sm">
                  Upvote jokes that make you laugh and downvote the ones that don&apos;t land.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <h3 className="text-white font-bold mb-1">Complete Quests</h3>
                <p className="text-gray-300 text-sm">
                  Earn Punny Power by completing quests and climb the leaderboard!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-yellow/30 rounded-2xl p-6 hover:border-fluorescent-yellow transition-all duration-300">
          <h2 className="text-2xl font-bold text-fluorescent-yellow mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>Features</span>
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-pink">🎨</span>
              <span className="text-gray-300">Vibrant fluorescent color theme</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-cyan">🌊</span>
              <span className="text-gray-300">Smooth motion effects and animations</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-green">🔊</span>
              <span className="text-gray-300">Interactive sound effects</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-orange">📱</span>
              <span className="text-gray-300">Mobile-first responsive design</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-purple">🔗</span>
              <span className="text-gray-300">Multi-wallet support</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-fluorescent-yellow">🚀</span>
              <span className="text-gray-300">Easy joke sharing</span>
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-pink/30 rounded-2xl p-6 hover:border-fluorescent-pink transition-all duration-300">
          <h2 className="text-2xl font-bold text-fluorescent-pink mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Tech Stack</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">React</p>
              <p className="text-gray-400 text-xs">UI Framework</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">Next.js</p>
              <p className="text-gray-400 text-xs">App Framework</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">Reown AppKit</p>
              <p className="text-gray-400 text-xs">Wallet Connect</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">Wagmi</p>
              <p className="text-gray-400 text-xs">Ethereum Hooks</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">Neynar</p>
              <p className="text-gray-400 text-xs">Farcaster SDK</p>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-fluorescent-cyan/20">
              <p className="text-fluorescent-cyan font-bold mb-1">Tailwind CSS</p>
              <p className="text-gray-400 text-xs">Styling</p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-fluorescent-purple/20 to-fluorescent-pink/20 border-2 border-fluorescent-purple rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🚧</span>
            <span>Coming Soon</span>
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Backend integration for persistent joke storage</li>
            <li>• Farcaster authentication via Neynar</li>
            <li>• Real-time leaderboard updates</li>
            <li>• NFT rewards for top comedians</li>
            <li>• Daily joke challenges</li>
            <li>• Custom emoji reactions</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-green/30 rounded-2xl p-6 hover:border-fluorescent-green transition-all duration-300">
          <h2 className="text-2xl font-bold text-fluorescent-green mb-4 flex items-center gap-2">
            <span>🌐</span>
            <span>Connect With Us</span>
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-fluorescent-purple/20 border-2 border-fluorescent-purple text-fluorescent-purple font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-300">
              Farcaster
            </button>
            <button className="bg-fluorescent-cyan/20 border-2 border-fluorescent-cyan text-fluorescent-cyan font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-300">
              Twitter
            </button>
            <button className="bg-fluorescent-pink/20 border-2 border-fluorescent-pink text-fluorescent-pink font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-300">
              Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
