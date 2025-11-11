import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/components/Web3Provider'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Jokes - Farcaster Miniapp',
  description: 'Share and vote on jokes in the Farcaster ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Web3Provider>
          <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
            <main className="pb-24">
              {children}
            </main>
            <BottomNav />
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}
