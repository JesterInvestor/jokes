import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, base, type AppKitNetwork } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'demo-project-id'

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set')
}

// Create a metadata object
export const metadata = {
  name: 'Jokes - Farcaster Miniapp',
  description: 'Share and vote on jokes in the Farcaster ecosystem',
  url: 'https://jokes.farcaster.app',
  icons: ['https://jokes.farcaster.app/icon.png']
}

// Create Wagmi Adapter
export const networks = [mainnet, base] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

// Create AppKit
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
    onramp: false
  }
})

// Create QueryClient
export const queryClient = new QueryClient()
