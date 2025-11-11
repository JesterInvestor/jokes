"use client"

import { useState, useEffect } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'

export default function Write() {
  const [joke, setJoke] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const maxChars = 280
  const maxFileSize = 5 * 1024 * 1024 // 5MB
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

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

    // Simulate submission (replace with actual backend call)
    setTimeout(() => {
      setIsSubmitting(false)
      setJoke('')
      setCharCount(0)
      // Clear file selection and revoke preview
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl)
        } catch (err) {}
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      setFileError(null)

      // Show success message
      alert(
        `🎉 Joke submitted!${selectedFile ? ' (with image)' : ''} Check it out on the Home page.`
      )
      router.push('/')
    }, 1500)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    const file = e.target.files?.[0] ?? null
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
      setFileError('Only images and GIFs are allowed')
      return
    }

    // Validate size
    if (file.size > maxFileSize) {
      setFileError('File is too large (max 5MB)')
      return
    }

    // Create preview
    const url = URL.createObjectURL(file)
    // Revoke previous preview
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl)
      } catch (err) {}
    }

    setSelectedFile(file)
    setPreviewUrl(url)
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl)
      } catch (err) {}
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setFileError(null)
  }

  const handleShare = () => {
    if (!joke.trim()) return

    try {
      const audio = new Audio('/sounds/share.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}

    // Try to share with file if available and supported
    const nav: any = navigator
    if (selectedFile && nav.canShare && nav.canShare({ files: [selectedFile] })) {
      nav
        .share({
          title: 'Check out my joke!',
          text: joke,
          files: [selectedFile],
          url: window.location.href,
        })
        .catch(() => {})
    } else if (nav.share) {
      nav
        .share({
          title: 'Check out my joke!',
          text: joke,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      // Fallback: Copy to clipboard (text only)
      navigator.clipboard
        .writeText(joke + (selectedFile ? '\n[image attached]' : ''))
        .then(() => {
          alert('Joke copied to clipboard!')
        })
        .catch(() => {})
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        {/* File upload */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-yellow/30 rounded-2xl p-6 transition-all duration-300">
          <label className="block mb-2 font-bold text-sm">Attach image or GIF (optional)</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="text-sm text-gray-300"
            />
            {selectedFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-sm px-3 py-2 rounded-full bg-gray-700 text-white"
              >
                Remove
              </button>
            )}
          </div>
          {fileError && <p className="text-sm text-fluorescent-pink mt-2">{fileError}</p>}

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              <div className="w-full max-h-80 overflow-hidden rounded-lg">
                <img src={previewUrl} alt="preview" className="w-full object-contain" />
              </div>
            </div>
          )}
        </div>
        <div className="bg-black/60 backdrop-blur-sm border-2 border-fluorescent-yellow/30 rounded-2xl p-6 focus-within:border-fluorescent-yellow transition-all duration-300">
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
                ? 'text-fluorescent-pink' 
                : 'text-fluorescent-cyan'
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
                ? 'bg-gradient-to-r from-fluorescent-yellow to-fluorescent-orange text-black hover:scale-105 glow-box cursor-pointer'
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
                ? 'bg-fluorescent-purple/20 border-2 border-fluorescent-purple text-fluorescent-purple hover:scale-105 cursor-pointer'
                : 'bg-gray-600 border-2 border-gray-500 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">📤</span>
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-12 bg-black/40 border-2 border-fluorescent-green/30 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-fluorescent-green mb-4">💡 Tips for Great Jokes</h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-fluorescent-cyan">•</span>
            <span>Keep it short and punchy!</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-fluorescent-cyan">•</span>
            <span>Puns are always a winner</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-fluorescent-cyan">•</span>
            <span>Make it family-friendly</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-fluorescent-cyan">•</span>
            <span>Original jokes get more votes!</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
