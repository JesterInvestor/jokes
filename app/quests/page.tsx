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
          ) : quests.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No quests found. Ensure <code>NEXT_PUBLIC_QUEST_REGISTRY_ADDRESS</code> is set in your environment.</div>
          ) : (
            quests.map((quest) => (
              <div key={quest.id} className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{(quest as any).icon ?? '🎯'}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-gray-400 text-sm">{(quest as any).description ?? ''}</p>
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
