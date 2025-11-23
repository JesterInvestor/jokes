"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuests } from '../../lib/useQuests'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  badges: string[]
}

interface Quest {
  id: number
  title: string
  description: string
  reward: number
  icon?: string
  active?: boolean
  eligible?: boolean
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const { quests, loading, refresh, claim } = useQuests()
  const { isConnected } = useAccount()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">🗺️ QUESTS 🗺️</h1>
        <p className="text-gray-500 text-lg">Complete quests and climb the leaderboard!</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('quests')} className={`flex-1 py-4 rounded-full ${activeTab === 'quests' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
          🎯 Quests
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 py-4 rounded-full ${activeTab === 'leaderboard' ? 'bg-cyan-400 text-black' : 'bg-gray-200 text-gray-800'}`}>
          🏆 Leaderboard
        </button>
      </div>

      {activeTab === 'quests' && (
        <div className="space-y-4">
          {!isConnected && (
            <div className="bg-yellow-100 rounded-2xl p-6 mb-6 text-center">
              <p className="text-lg">Connect your wallet to track quest progress!</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading quests...</div>
          ) : (
            quests.map((quest) => (
              <div key={quest.id} className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{quest.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>
                  {quest.claimed && <span className="text-2xl">✅</span>}
                </div>

                {quest.eligible && !quest.claimed && (
                  <div className="bg-green-100 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-bold">🎉 Eligible: +{quest.reward}</span>
                      <button
                        onClick={async () => {
                          try {
                            await claim(quest.id)
                            alert('Claimed reward!')
                          } catch (e) {
                            alert('Claim failed: ' + ((e as any)?.message ?? String(e)))
                          }
                        }}
                        className="ml-4 px-4 py-2 rounded-full bg-green-600 text-white font-bold"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboardData.map((entry) => (
            <div key={entry.rank} className="bg-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-gray-700">{entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] ?? entry.rank : entry.rank}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                    </div>
                    <span className="text-sm text-gray-400">{entry.score.toLocaleString()} Punny Power</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-300">{entry.score}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuests } from '../../lib/useQuests'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  badges: string[]
}

interface Quest {
  id: number
  title: string
  description: string
  reward: number
  icon?: string
  active?: boolean
  eligible?: boolean
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const { quests, loading, refresh, claim } = useQuests()
  const { isConnected } = useAccount()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">🗺️ QUESTS 🗺️</h1>
        <p className="text-gray-300 text-lg">Complete quests and climb the leaderboard!</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('quests')} className={`flex-1 py-4 rounded-full ${activeTab === 'quests' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
          🎯 Quests
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 py-4 rounded-full ${activeTab === 'leaderboard' ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-gray-300'}`}>
          🏆 Leaderboard
        </button>
      </div>

      {activeTab === 'quests' && (
        <div className="space-y-4">
          {!isConnected && (
            <div className="bg-yellow-800 rounded-2xl p-6 mb-6 text-center">
              <p className="text-lg">Connect your wallet to track quest progress!</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading quests...</div>
          ) : (
            quests.map((quest) => (
              <div key={quest.id} className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{quest.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>
                  {quest.claimed && <span className="text-2xl">✅</span>}
                </div>

                {quest.eligible && !quest.claimed && (
                  <div className="bg-green-800 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-green-200 font-bold">🎉 Eligible: +{quest.reward}</span>
                      <button
                        onClick={async () => {
                          try {
                            await claim(quest.id)
                            alert('Claimed reward!')
                          } catch (e) {
                            alert('Claim failed: ' + ((e as any)?.message ?? String(e)))
                          }
                        }}
                        className="ml-4 px-4 py-2 rounded-full bg-green-400 text-black font-bold"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboardData.map((entry) => (
            <div key={entry.rank} className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-gray-700">{entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] ?? entry.rank : entry.rank}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                    </div>
                    <span className="text-sm text-gray-400">{entry.score.toLocaleString()} Punny Power</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-cyan-300">{entry.score}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuests } from '../../lib/useQuests'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  badges: string[]
}

interface Quest {
  id: number
  title: string
  description: string
  reward: number
  icon?: string
  active?: boolean
  eligible?: boolean
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

// (quests are fetched from the on-chain QuestRegistry via `useQuests`)

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const { quests, loading, refresh, claim } = useQuests()
  const { isConnected } = useAccount()

  // Quests are fetched from the chain; claiming is handled by `useQuests`'s `claim`.

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-purple animate-pulse-glow">
          🗺️ QUESTS 🗺️
        </h1>
        <p className="text-fluorescent-cyan text-lg">
          Complete quests and climb the leaderboard!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink text-white scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-purple/30 text-gray-400 hover:border-fluorescent-purple/60'
          }`}
        >
          🎯 Quests
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-fluorescent-cyan to-fluorescent-green text-black scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-cyan/30 text-gray-400 hover:border-fluorescent-cyan/60'
          }`}
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Quests Tab */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {!isConnected && (
            <div className="bg-fluorescent-orange/20 border-2 border-fluorescent-orange rounded-2xl p-6 mb-6 text-center">
              <p className="text-lg">Connect your wallet to track quest progress!</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading quests...</div>
          ) : (
            quests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                  quest.active ? 'border-fluorescent-purple/30 hover:border-fluorescent-purple' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{quest.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>
                  {quest.claimed && <span className="text-2xl animate-float">✅</span>}
                </div>

                {/* Progress Bar */}
                {!quest.claimed && !quest.completed && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-fluorescent-cyan">Reward: {quest.reward} Punny Power</span>
                      <span className="text-fluorescent-yellow">{quest.eligible ? 'Eligible' : 'Not eligible'}</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-fluorescent-purple/30">
                      <div className="h-full bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}

                {quest.eligible && !quest.claimed && (
                  <div className="bg-fluorescent-green/20 border border-fluorescent-green rounded-lg p-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-fluorescent-green font-bold">🎉 Eligible: +{quest.reward} Punny Power</span>
                      <button
                        onClick={async () => {
                          try {
                            await claim(quest.id)
                            alert('Claimed reward!')
                          } catch (e) {
                            alert('Claim failed: ' + ((e as any)?.message ?? String(e)))
                          }
                        }}
                        className="ml-4 px-4 py-2 rounded-full bg-fluorescent-green text-black font-bold"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!quest.eligible && !quest.claimed && (
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => alert('This quest is not eligible for your account yet.')}
                      className="px-4 py-2 rounded-full bg-fluorescent-purple text-white font-bold"
                    >
                      How to qualify
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.rank}
              className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                entry.rank === 1
                  ? 'border-fluorescent-yellow glow-box'
                  : entry.rank === 2
                  ? 'border-gray-400'
                  : entry.rank === 3
                  ? 'border-orange-600'
                  : 'border-fluorescent-cyan/30 hover:border-fluorescent-cyan'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-fluorescent-yellow to-fluorescent-orange text-black'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                        : entry.rank === 3
                        ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white'
                        : 'bg-black/40 text-fluorescent-cyan border-2 border-fluorescent-cyan/30'
                    }`}
                  >
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </div>

                  {/* Username */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                      {entry.badges.map((badge, i) => (
                        <span key={i} className="text-lg">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {entry.score.toLocaleString()} Punny Power
                    </span>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-fluorescent-cyan">
                    {entry.score}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Your Rank Placeholder */}
          {isConnected && (
            <div className="bg-fluorescent-purple/20 border-2 border-fluorescent-purple rounded-2xl p-6 text-center">
              <p className="text-lg mb-2">Your Current Rank</p>
              <p className="text-4xl font-bold text-fluorescent-purple mb-2">#--</p>
              <p className="text-sm text-gray-400">Start completing quests to get ranked!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuests } from '../../lib/useQuests'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  badges: string[]
}

interface Quest {
  id: number
  title: string
  description: string
  reward: number
  icon?: string
  active?: boolean
  eligible?: boolean
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

// (quests are fetched from the on-chain QuestRegistry via `useQuests`)

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const { quests, loading, refresh, claim } = useQuests()
  const { isConnected } = useAccount()

  // Quests are fetched from the chain; claiming is handled by `useQuests`'s `claim`.

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-purple animate-pulse-glow">
          🗺️ QUESTS 🗺️
        </h1>
        <p className="text-fluorescent-cyan text-lg">
          Complete quests and climb the leaderboard!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink text-white scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-purple/30 text-gray-400 hover:border-fluorescent-purple/60'
          }`}
        >
          🎯 Quests
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-fluorescent-cyan to-fluorescent-green text-black scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-cyan/30 text-gray-400 hover:border-fluorescent-cyan/60'
          }`}
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Quests Tab */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {!isConnected && (
            <div className="bg-fluorescent-orange/20 border-2 border-fluorescent-orange rounded-2xl p-6 mb-6 text-center">
              <p className="text-lg">Connect your wallet to track quest progress!</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading quests...</div>
          ) : (
            quests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                  quest.active ? 'border-fluorescent-purple/30 hover:border-fluorescent-purple' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{quest.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>
                  {quest.claimed && <span className="text-2xl animate-float">✅</span>}
                </div>

                {/* Progress Bar */}
                {!quest.claimed && !quest.completed && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-fluorescent-cyan">Reward: {quest.reward} Punny Power</span>
                      <span className="text-fluorescent-yellow">{quest.eligible ? 'Eligible' : 'Not eligible'}</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-fluorescent-purple/30">
                      <div className="h-full bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}

                {quest.eligible && !quest.claimed && (
                  <div className="bg-fluorescent-green/20 border border-fluorescent-green rounded-lg p-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-fluorescent-green font-bold">🎉 Eligible: +{quest.reward} Punny Power</span>
                      <button
                        onClick={async () => {
                          try {
                            await claim(quest.id)
                            alert('Claimed reward!')
                          } catch (e) {
                            alert('Claim failed: ' + ((e as any)?.message ?? String(e)))
                          }
                        }}
                        className="ml-4 px-4 py-2 rounded-full bg-fluorescent-green text-black font-bold"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!quest.eligible && !quest.claimed && (
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => alert('This quest is not eligible for your account yet.')}
                      className="px-4 py-2 rounded-full bg-fluorescent-purple text-white font-bold"
                    >
                      How to qualify
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.rank}
              className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                entry.rank === 1
                  ? 'border-fluorescent-yellow glow-box'
                  : entry.rank === 2
                  ? 'border-gray-400'
                  : entry.rank === 3
                  ? 'border-orange-600'
                  : 'border-fluorescent-cyan/30 hover:border-fluorescent-cyan'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-fluorescent-yellow to-fluorescent-orange text-black'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                        : entry.rank === 3
                        ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white'
                        : 'bg-black/40 text-fluorescent-cyan border-2 border-fluorescent-cyan/30'
                    }`}
                  >
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </div>

                  {/* Username */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                      {entry.badges.map((badge, i) => (
                        <span key={i} className="text-lg">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {entry.score.toLocaleString()} Punny Power
                    </span>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-fluorescent-cyan">
                    {entry.score}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Your Rank Placeholder */}
          {isConnected && (
            <div className="bg-fluorescent-purple/20 border-2 border-fluorescent-purple rounded-2xl p-6 text-center">
              <p className="text-lg mb-2">Your Current Rank</p>
              <p className="text-4xl font-bold text-fluorescent-purple mb-2">#--</p>
              <p className="text-sm text-gray-400">Start completing quests to get ranked!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useQuests } from '../../lib/useQuests'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  badges: string[]
}

interface Quest {
  id: number
  title: string
  description: string
  reward: number
  icon?: string
  active?: boolean
  eligible?: boolean
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

// (quests are fetched from the on-chain QuestRegistry via `useQuests`)

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const { quests, loading, refresh, claim } = useQuests()
  const { isConnected } = useAccount()

  // Quests are fetched from the chain; claiming is handled by `useQuests`'s `claim`.

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-purple animate-pulse-glow">
          🗺️ QUESTS 🗺️
        </h1>
        <p className="text-fluorescent-cyan text-lg">
          Complete quests and climb the leaderboard!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'quests'
              ? 'bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink text-white scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-purple/30 text-gray-400 hover:border-fluorescent-purple/60'
          }`}
        >
          🎯 Quests
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-fluorescent-cyan to-fluorescent-green text-black scale-105 glow-box'
              : 'bg-black/40 border-2 border-fluorescent-cyan/30 text-gray-400 hover:border-fluorescent-cyan/60'
          }`}
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Quests Tab */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {!isConnected && (
            <div className="bg-fluorescent-orange/20 border-2 border-fluorescent-orange rounded-2xl p-6 mb-6 text-center">
              <p className="text-lg">Connect your wallet to track quest progress!</p>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading quests...</div>
          ) : (
            quests.map((quest) => (
              <div
                key={quest.id}
                className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                  quest.active ? 'border-fluorescent-purple/30 hover:border-fluorescent-purple' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{quest.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{quest.description}</p>
                    </div>
                  </div>
                  {quest.claimed && <span className="text-2xl animate-float">✅</span>}
                </div>

                {/* Progress Bar */}
                {!quest.claimed && !quest.completed && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-fluorescent-cyan">Reward: {quest.reward} Punny Power</span>
                      <span className="text-fluorescent-yellow">{quest.eligible ? 'Eligible' : 'Not eligible'}</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-fluorescent-purple/30">
                      <div className="h-full bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}

                {quest.eligible && !quest.claimed && (
                  <div className="bg-fluorescent-green/20 border border-fluorescent-green rounded-lg p-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-fluorescent-green font-bold">🎉 Eligible: +{quest.reward} Punny Power</span>
                      <button
                        onClick={async () => {
                          try {
                            await claim(quest.id)
                            alert('Claimed reward!')
                          } catch (e) {
                            alert('Claim failed: ' + ((e as any)?.message ?? String(e)))
                          }
                        }}
                        className="ml-4 px-4 py-2 rounded-full bg-fluorescent-green text-black font-bold"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!quest.eligible && !quest.claimed && (
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => alert('This quest is not eligible for your account yet.')}
                      className="px-4 py-2 rounded-full bg-fluorescent-purple text-white font-bold"
                    >
                      How to qualify
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.rank}
              className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                entry.rank === 1
                  ? 'border-fluorescent-yellow glow-box'
                  : entry.rank === 2
                  ? 'border-gray-400'
                  : entry.rank === 3
                  ? 'border-orange-600'
                  : 'border-fluorescent-cyan/30 hover:border-fluorescent-cyan'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-fluorescent-yellow to-fluorescent-orange text-black'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                        : entry.rank === 3
                        ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white'
                        : 'bg-black/40 text-fluorescent-cyan border-2 border-fluorescent-cyan/30'
                    }`}
                  >
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </div>

                  {/* Username */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">@{entry.username}</span>
                      {entry.badges.map((badge, i) => (
                        <span key={i} className="text-lg">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {entry.score.toLocaleString()} Punny Power
                    </span>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-fluorescent-cyan">
                    {entry.score}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Your Rank Placeholder */}
          {isConnected && (
            <div className="bg-fluorescent-purple/20 border-2 border-fluorescent-purple rounded-2xl p-6 text-center">
              <p className="text-lg mb-2">Your Current Rank</p>
              <p className="text-4xl font-bold text-fluorescent-purple mb-2">#--</p>
              <p className="text-sm text-gray-400">Start completing quests to get ranked!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
