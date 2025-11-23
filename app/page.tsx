'use client'

import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { useVote } from '../lib/contractHelpers'
import { useJokes } from '../lib/useJokes'
import CallSdkReady from '@/components/CallSdkReady'
 

interface Joke {
  id: number
  content: string
  author: string
  votes: number
  userVote: number | null
}

export default function Home() {
  const { jokes, loading, refresh, setJokes } = useJokes()
  const [pendingTxs, setPendingTxs] = useState<Record<number, string | null>>({})
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { vote, isLoading: voteLoading } = useVote(undefined, refresh)
  const contractAddress = process.env.NEXT_PUBLIC_JOKE_VOTING_ADDRESS
  // Event subscriptions and fetching handled inside `useJokes` hook

  const handleVote = (jokeId: number, voteType: number) => {
    if (!isConnected) {
      open()
      return
    }

    // optimistic UI: mark tx pending and adjust vote locally
    setJokes(prev => prev.map(j => {
      if (j.id !== jokeId) return j
      const currentVote = j.userVote
      let newVotes = j.votes
      let newUserVote: number | null = voteType

      if (currentVote === voteType) {
        newVotes -= voteType
        newUserVote = null
      } else if (currentVote !== null) {
        newVotes = newVotes - currentVote + voteType
      } else {
        newVotes += voteType
      }

      return { ...j, votes: newVotes, userVote: newUserVote }
    }))

    // Play sound
    try { const audio = new Audio('/sounds/vote.mp3'); audio.volume = 0.3; audio.play().catch(()=>{}) } catch(e) {}

    // send on-chain tx
    (async () => {
      try {
        setPendingTxs(prev => ({ ...prev, [jokeId]: 'pending' }))
        const txHash = await vote(jokeId, voteType as 1 | -1)
        if (txHash) {
          setPendingTxs(prev => ({ ...prev, [jokeId]: txHash }))
        }
      } catch (err) {
        console.error('Vote tx failed', err)
        setPendingTxs(prev => ({ ...prev, [jokeId]: null }))
        alert('Vote transaction failed')
      }
    })()
  }

  const handleShare = (joke: Joke) => {
    try {
      const audio = new Audio('/sounds/share.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}

    if (navigator.share) {
      navigator.share({
        title: 'Check out this joke!',
        text: joke.content,
        url: window.location.href,
      }).catch(() => {})
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(joke.content).then(() => {
        alert('Joke copied to clipboard!')
      }).catch(() => {})
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CallSdkReady />
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-brand-magenta animate-pulse-glow">
          😄 JOKES 😄
        </h1>
        <p className="text-brand-pink text-lg">
          The funniest miniapp on Farcaster
        </p>
        
        {/* Wallet Connection */}
        <div className="mt-6">
          {isConnected ? (
            <div className="flex items-center justify-center gap-3 bg-black/40 border-2 border-brand-orange rounded-full px-6 py-3 inline-flex">
              <span className="text-brand-orange">✓</span>
              <span className="text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="bg-gradient-to-r from-brand-pink to-brand-magenta text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300 glow-box"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Jokes List */}
      <div className="space-y-6">
        {jokes.map((joke) => (
          <div
            key={joke.id}
            className="bg-black/60 backdrop-blur-sm border-2 border-brand-magenta/30 rounded-2xl p-6 hover:border-brand-magenta transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Joke Content */}
            <p className="text-lg mb-4 leading-relaxed">{joke.content}</p>
            
            {/* Author */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-brand-yellow">
                by @{joke.author}
              </span>
            </div>

            {/* Voting UI */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Upvote */}
                <button
                  onClick={() => handleVote(joke.id, 1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      joke.userVote === 1
                      ? 'bg-brand-orange text-black scale-110'
                      : 'bg-black/40 hover:bg-brand-orange/20 border border-brand-orange/50'
                  }`}
                >
                  <span className="text-xl">👍</span>
                </button>

                {/* Vote Count */}
                  <span className={`font-bold text-xl ${
                  joke.votes > 0 ? 'text-brand-orange' : 
                  joke.votes < 0 ? 'text-brand-pink' : 
                  'text-gray-400'
                }`}>
                  {joke.votes}
                </span>

                {/* Downvote */}
                <button
                  onClick={() => handleVote(joke.id, -1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      joke.userVote === -1
                      ? 'bg-brand-pink text-black scale-110'
                      : 'bg-black/40 hover:bg-brand-pink/20 border border-brand-pink/50'
                  }`}
                >
                  <span className="text-xl">👎</span>
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={() => handleShare(joke)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-brand-magenta/50 hover:bg-brand-magenta/20 transition-all duration-300 hover:scale-105"
              >
                <span className="text-xl">🚀</span>
                <span className="text-sm font-bold text-brand-magenta">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      {jokes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-400">No jokes yet! Be the first to write one! ✍️</p>
        </div>
      )}
    </div>
  )
}
