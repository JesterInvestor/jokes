'use client'

import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

interface Joke {
  id: number
  content: string
  author: string
  votes: number
  userVote: number | null
}

const initialJokes: Joke[] = [
  {
    id: 1,
    content: "Why don't scientists trust atoms? Because they make up everything!",
    author: 'JokesMaster',
    votes: 42,
    userVote: null,
  },
  {
    id: 2,
    content: "What do you call a bear with no teeth? A gummy bear!",
    author: 'PunKing',
    votes: 38,
    userVote: null,
  },
  {
    id: 3,
    content: "Why did the scarecrow win an award? Because he was outstanding in his field!",
    author: 'FarmerJokes',
    votes: 35,
    userVote: null,
  },
]

export default function Home() {
  const [jokes, setJokes] = useState<Joke[]>(initialJokes)
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()

  const handleVote = (jokeId: number, voteType: number) => {
    if (!isConnected) {
      open()
      return
    }

    setJokes(jokes.map(joke => {
      if (joke.id === jokeId) {
        const currentVote = joke.userVote
        let newVotes = joke.votes
        let newUserVote: number | null = voteType

        // If already voted the same way, remove vote
        if (currentVote === voteType) {
          newVotes -= voteType
          newUserVote = null
        } 
        // If voted differently before, remove old vote and add new
        else if (currentVote !== null) {
          newVotes = newVotes - currentVote + voteType
        } 
        // New vote
        else {
          newVotes += voteType
        }

        return { ...joke, votes: newVotes, userVote: newUserVote }
      }
      return joke
    }))

    // Play sound
    try {
      const audio = new Audio('/sounds/vote.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-cyan animate-pulse-glow">
          😄 JOKES 😄
        </h1>
        <p className="text-fluorescent-pink text-lg">
          The funniest miniapp on Farcaster
        </p>
        
        {/* Wallet Connection */}
        <div className="mt-6">
          {isConnected ? (
            <div className="flex items-center justify-center gap-3 bg-black/40 border-2 border-fluorescent-green rounded-full px-6 py-3 inline-flex">
              <span className="text-fluorescent-green">✓</span>
              <span className="text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="bg-gradient-to-r from-fluorescent-pink to-fluorescent-purple text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300 glow-box"
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
            className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-cyan/30 rounded-2xl p-6 hover:border-fluorescent-cyan transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Joke Content */}
            <p className="text-lg mb-4 leading-relaxed">{joke.content}</p>
            
            {/* Author */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-fluorescent-yellow">
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
                      ? 'bg-fluorescent-green text-black scale-110'
                      : 'bg-black/40 hover:bg-fluorescent-green/20 border border-fluorescent-green/50'
                  }`}
                >
                  <span className="text-xl">👍</span>
                </button>

                {/* Vote Count */}
                <span className={`font-bold text-xl ${
                  joke.votes > 0 ? 'text-fluorescent-green' : 
                  joke.votes < 0 ? 'text-fluorescent-pink' : 
                  'text-gray-400'
                }`}>
                  {joke.votes}
                </span>

                {/* Downvote */}
                <button
                  onClick={() => handleVote(joke.id, -1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    joke.userVote === -1
                      ? 'bg-fluorescent-pink text-black scale-110'
                      : 'bg-black/40 hover:bg-fluorescent-pink/20 border border-fluorescent-pink/50'
                  }`}
                >
                  <span className="text-xl">👎</span>
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={() => handleShare(joke)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-fluorescent-purple/50 hover:bg-fluorescent-purple/20 transition-all duration-300 hover:scale-105"
              >
                <span className="text-xl">🚀</span>
                <span className="text-sm font-bold text-fluorescent-purple">Share</span>
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
