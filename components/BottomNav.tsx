'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { path: '/', icon: '😄', label: 'Home' },
  { path: '/write', icon: '✍️', label: 'Write' },
  { path: '/quests', icon: '🗺️', label: 'Quests' },
  { path: '/info', icon: 'ℹ️', label: 'Info' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [playSound] = useState(() => {
    if (typeof window !== 'undefined') {
      return (soundName: string) => {
        try {
          const audio = new Audio(`/sounds/${soundName}.mp3`)
          audio.volume = 0.3
          audio.play().catch(() => {
            // Ignore audio play errors (autoplay restrictions)
          })
        } catch (e) {
          // Ignore audio errors
        }
      }
    }
    return () => {}
  })

  const handleNavClick = (path: string) => {
    playSound('click')
    router.push(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t-2 border-brand-magenta z-50">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 transform ${
                isActive
                  ? 'scale-110 text-brand-magenta drop-shadow-[0_0_10px_rgba(183,35,155,0.8)]'
                  : 'text-gray-400 hover:text-brand-pink hover:scale-105'
              }`}
            >
              <span className={`text-2xl ${isActive ? 'animate-float' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs font-bold tracking-wide">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
