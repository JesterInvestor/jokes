'use client'

import React, { ReactNode, useEffect } from 'react'
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient, networks } from '@/lib/config'

const CELO_SEPOLIA_CHAIN_ID = 11142220

function NetworkGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (!isConnected) return

    const provider = (window as any).ethereum
    if (!provider) return

    async function ensureSepolia() {
      try {
        let currentChainHex = provider.chainId
        if (!currentChainHex && provider.request) {
          try {
            currentChainHex = await provider.request({ method: 'eth_chainId' })
          } catch (e) {
            // ignore
          }
        }

        const currentChainId = currentChainHex ? Number(currentChainHex) : null
        if (currentChainId === CELO_SEPOLIA_CHAIN_ID) return

        const hexChainId = '0x' + CELO_SEPOLIA_CHAIN_ID.toString(16)

        // Try provider-based switch
        if (provider.request) {
          try {
            await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChainId }] })
            return
          } catch (switchError) {
            if (switchError && (switchError as any).code === 4902) {
              const sepoliaNetwork = networks?.[0]
              const rpc = sepoliaNetwork?.rpcUrl || 'https://rpc.ankr.com/celo_sepolia'
              try {
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: hexChainId,
                    chainName: 'Celo Sepolia',
                    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
                    rpcUrls: [rpc],
                    blockExplorerUrls: ['https://explorer.celo.org/sepolia']
                  }]
                })
                return
              } catch (addError) {
                console.warn('wallet_addEthereumChain failed', addError)
                try { disconnect() } catch (e) {}
              }
            } else {
              console.warn('wallet_switchEthereumChain failed', switchError)
              try { disconnect() } catch (e) {}
            }
          }
        }
      } catch (e) {
        console.warn('ensureSepolia error', e)
      }
    }

    ensureSepolia()
  }, [isConnected, disconnect])

  return <>{children}</>
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkGuard>
          {children}
        </NetworkGuard>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
