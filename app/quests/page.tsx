'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

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
  icon: string
  completed: boolean
  progress: number
  total: number
  claimed?: boolean
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'JokesMaster', score: 1337, badges: ['🏆', '🎭', '⚡'] },
  { rank: 2, username: 'PunKing', score: 1025, badges: ['🎭', '⚡'] },
  { rank: 3, username: 'LaughLord', score: 892, badges: ['🎭'] },
  { rank: 4, username: 'ComedyCrafter', score: 756, badges: ['⚡'] },
  { rank: 5, username: 'ChuckleChamp', score: 634, badges: [] },
]

const questsData: Quest[] = [
  {
    id: 1,
    title: 'First Laugh',
    description: 'Submit your first joke',
    reward: 10,
    icon: '😄',
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: 2,
    title: 'Pun Master',
    description: 'Get 50 upvotes on a single joke',
    reward: 50,
    icon: '🎭',
    completed: false,
    progress: 0,
    total: 50,
  },
  {
    id: 3,
    title: 'Comedy Marathon',
    description: 'Submit 10 jokes',
    reward: 100,
    icon: '✍️',
    completed: false,
    progress: 0,
    total: 10,
  },
  {
    id: 4,
    title: 'Voting Virtuoso',
    description: 'Vote on 100 jokes',
    reward: 75,
    icon: '🗳️',
    completed: false,
    progress: 0,
    total: 100,
  },
  {
    id: 6,
    title: 'Daily Dose',
    description: 'Submit a joke every day for a week',
    reward: 200,
    icon: '📅',
    completed: false,
    progress: 0,
    total: 7,
  },
  {
    id: 7,
    title: 'Meme Maestro',
    description: 'Upload an image or GIF with your joke',
    reward: 30,
    icon: '🖼️',
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: 8,
    title: 'Share the Laughs',
    description: 'Share a joke using the Share button',
    reward: 20,
    icon: '📤',
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: 9,
    title: 'Welcome Aboard',
    description: 'Connect your wallet to get started',
    reward: 5,
    icon: '🔐',
    completed: false,
    progress: 0,
    total: 1,
  },
]

export default function Quests() {
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard'>('quests')
  const [quests, setQuests] = useState<Quest[]>(questsData)
  const { isConnected } = useAccount()

  // Increment progress for a quest (simulate action)
  const incrementProgress = (id: number, amount = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q
        const newProgress = Math.min(q.total, q.progress + amount)
        return {
          ...q,
          progress: newProgress,
          completed: newProgress >= q.total,
        }
      })
    )
  }

  const claimReward = (id: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q
        if (!q.completed || q.claimed) return q
        // mark claimed
        setTimeout(() => {
          // small delay to simulate processing
        }, 200)
        alert(`🎉 Claimed +${q.reward} Punny Power for '${q.title}'`)
        return { ...q, claimed: true }
      })
    )
  }

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

          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`bg-black/60 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                quest.completed
                  ? 'border-fluorescent-green'
                  : 'border-fluorescent-purple/30 hover:border-fluorescent-purple'
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
                {quest.completed && (
                  <span className="text-2xl animate-float">✅</span>
                )}
              </div>

              {/* Progress Bar */}
              {!quest.completed && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-fluorescent-cyan">
                      Progress: {quest.progress}/{quest.total}
                    </span>
                    <span className="text-fluorescent-yellow">
                      +{quest.reward} Punny Power
                    </span>
                  </div>
                  <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-fluorescent-purple/30">
                    <div
                      className="h-full bg-gradient-to-r from-fluorescent-purple to-fluorescent-pink transition-all duration-500"
                      style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {quest.completed && (
                <div className="bg-fluorescent-green/20 border border-fluorescent-green rounded-lg p-3 text-center">
                  <div className="flex items-center justify-between">
                    <span className="text-fluorescent-green font-bold">
                      🎉 Completed! +{quest.reward} Punny Power earned!
                    </span>
                    {!quest.claimed ? (
                      <button
                        onClick={() => claimReward(quest.id)}
                        className="ml-4 px-4 py-2 rounded-full bg-fluorescent-green text-black font-bold"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="text-sm text-gray-300">Claimed</span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {!quest.completed && (
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => incrementProgress(quest.id, 1)}
                    className="px-4 py-2 rounded-full bg-fluorescent-purple text-white font-bold"
                  >
                    Do it
                  </button>
                  <button
                    onClick={() => incrementProgress(quest.id, quest.total)}
                    className="px-4 py-2 rounded-full bg-black/40 border border-fluorescent-purple text-gray-200"
                  >
                    Complete (simulate)
                  </button>
                  {!isConnected && quest.title === 'Welcome Aboard' && (
                    <span className="text-sm text-fluorescent-orange">Connect your wallet to complete this quest</span>
                  )}
                </div>
              )}
            </div>
          ))}
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
