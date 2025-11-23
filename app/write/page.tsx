"use client"

import { useState, useEffect } from 'react'
import { useAppKit } from '@reown/appkit/react'
import CallSdkReady from '@/components/CallSdkReady'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useAddJoke } from '../../lib/contractHelpers'

export default function Write() {
  const [joke, setJoke] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const maxChars = 280
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const { addJoke, isLoading: addLoading } = useAddJoke()

  

  // AI generator state
  const [aiPrompt, setAiPrompt] = useState('')
  const [generatedJoke, setGeneratedJoke] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleJokeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setJoke(text)
      setCharCount(text.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      open()
      return
    }

    if (!joke.trim()) {
      return
    }
    setIsSubmitting(true)

    // Play sound
    try {
      const audio = new Audio('/sounds/submit.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}

    try {
      // call on-chain addJoke (no client-side preview URL used)
      const hash = await addJoke(joke.trim(), '')
      // show a toast or simple alert for pending tx
      if (hash) {
        alert('Transaction sent: ' + hash + '\nWaiting for confirmation...')
      }

      // After success, clear form
      setJoke('')
      setCharCount(0)

      alert('🎉 Joke submitted on-chain! It will appear after indexing.')
      router.push('/')
    } catch (err) {
      console.error('Add joke tx failed', err)
      alert('Failed to submit joke: ' + ((err as any)?.message ?? String(err)))
    } finally {
      setIsSubmitting(false)
    }
  }

  

  const handleShare = () => {
    if (!joke.trim()) return

    try {
      const audio = new Audio('/sounds/share.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}

    const nav: any = navigator
    if (nav.share) {
      nav
        .share({
          title: 'Check out my joke!',
          text: joke,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard
        .writeText(joke)
        .then(() => {
          alert('Joke copied to clipboard!')
        })
        .catch(() => {})
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CallSdkReady />
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 glow-text text-fluorescent-yellow animate-pulse-glow">
          ✍️ WRITE A JOKE ✍️
        </h1>
        <p className="text-gray-200 text-lg leading-relaxed">
          Share your funniest joke with the Farcaster community
        </p>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-fluorescent-pink/20 border-2 border-fluorescent-pink rounded-2xl p-6 mb-8 text-center">
          <p className="text-lg mb-4">Connect your wallet to submit jokes!</p>
          <button
            onClick={() => open()}
            className="bg-gradient-to-r from-fluorescent-pink to-fluorescent-purple text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform duration-300 glow-box"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Joke Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File upload removed */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-brand-yellow/30 rounded-2xl p-6 focus-within:border-brand-yellow transition-all duration-300">
          <label className="block mb-3 text-sm text-gray-300">Or generate one with AI</label>
          <div className="flex gap-2 mb-3">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. puns about cats, dad jokes, programming humor"
              className="flex-1 bg-black/30 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={async () => {
                setGenerating(true)
                setGeneratedJoke(null)
                try {
                  const res = await fetch('/api/ai-joke', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: aiPrompt })
                  })
                  const data = await res.json()
                  setGeneratedJoke(data?.joke ?? null)
                } catch (e) {
                  console.error('AI generate failed', e)
                  setGeneratedJoke('Whoops, AI failed to generate a joke.')
                } finally {
                  setGenerating(false)
                }
              }}
              className={`px-4 py-2 rounded-md font-semibold ${generating ? 'bg-gray-600 text-gray-300' : 'bg-brand-magenta text-white hover:scale-105'}`}
            >
              {generating ? 'Generating…' : 'Generate'}
            </button>
          </div>

          {generatedJoke && (
            <div className="mb-4 p-4 bg-black/50 border border-brand-magenta rounded-md">
              <div className="text-sm text-gray-200 mb-2">AI Suggestion</div>
              <div className="text-lg text-white mb-3">{generatedJoke}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJoke((prev) => (prev ? `${prev}\n\n${generatedJoke}` : generatedJoke))
                    setGeneratedJoke(null)
                    setAiPrompt('')
                  }}
                  className="px-4 py-2 rounded-full bg-brand-yellow text-black font-bold hover:scale-105"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => setGeneratedJoke(null)}
                  className="px-4 py-2 rounded-full bg-gray-700 text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <textarea
            value={joke}
            onChange={handleJokeChange}
            placeholder="Type your joke here... Make it punny! 😄"
            className="w-full bg-transparent text-white text-lg placeholder-gray-400 resize-none focus:outline-none min-h-[200px]"
            disabled={isSubmitting}
          />
          
          {/* Character Count */}
            <div className="flex justify-end mt-4">
            <span className={`text-sm font-bold ${
              charCount > maxChars * 0.9 
                ? 'text-brand-pink' 
                : 'text-brand-magenta'
            }`}>
              {charCount} / {maxChars}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!joke.trim() || isSubmitting || !isConnected}
            className={`flex-1 font-bold py-4 rounded-full transition-all duration-300 ${
              joke.trim() && isConnected && !isSubmitting
                ? 'bg-gradient-to-r from-brand-yellow to-brand-orange text-black hover:scale-105 glow-box cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Submit Joke
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={!joke.trim()}
            className={`px-6 py-4 rounded-full font-bold transition-all duration-300 ${
              joke.trim()
                ? 'bg-brand-magenta/20 border-2 border-brand-magenta text-brand-magenta hover:scale-105 cursor-pointer'
                : 'bg-gray-600 border-2 border-gray-500 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">📤</span>
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-12 bg-black/40 border-2 border-brand-orange/30 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-brand-orange mb-4">💡 Tips for Great Jokes</h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-brand-magenta">•</span>
            <span>Keep it short and punchy!</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-magenta">•</span>
            <span>Puns are always a winner</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-magenta">•</span>
            <span>Make it family-friendly</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-magenta">•</span>
            <span>Original jokes get more votes!</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
