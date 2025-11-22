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
// Prefer Celo networks: Celo Mainnet and Celo Sepolia (testnet)
const CELO_MAINNET_RPC = process.env.CELO_MAINNET_RPC || process.env.RPC_URL || 'https://forno.celo.org'
const CELO_SEPOLIA_RPC = process.env.CELO_SEPOLIA_RPC || process.env.RPC_URL || process.env.CELO_ALFAJORES_RPC || ''

const celoMainnet: AppKitNetwork = ({
  id: 'celo-mainnet',
  name: 'Celo Mainnet',
  chainId: 42220,
  rpcUrl: CELO_MAINNET_RPC,
  nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
} as unknown) as AppKitNetwork

const celoSepolia: AppKitNetwork = ({
  id: 'celo-sepolia',
  name: 'Celo Sepolia',
  chainId: 11142220,
  rpcUrl: CELO_SEPOLIA_RPC || 'https://rpc.ankr.com/celo_sepolia',
  nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
} as unknown) as AppKitNetwork

export const networks = [celoSepolia, celoMainnet] as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  storage: (createStorage({
    storage: cookieStorage
  }) as any),
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
  // Default to the test Celo Sepolia network for autoconnect/switch behavior
  defaultNetwork: celoSepolia as any,
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
