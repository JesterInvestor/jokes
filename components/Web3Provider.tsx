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
              const rpc = (sepoliaNetwork as any)?.rpcUrl || (sepoliaNetwork as any)?.rpcUrls?.default?.http?.[0] || 'https://rpc.ankr.com/celo_sepolia'
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
                // After adding, try switching again but do not force-disconnect on failure
                try {
                  await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChainId }] })
                } catch (e) {
                  console.warn('wallet_switchEthereumChain after add failed', e)
                }
                return
              } catch (addError) {
                console.warn('wallet_addEthereumChain failed', addError)
                // don't disconnect automatically — just surface the error and allow the user to act
              }
            } else {
              console.warn('wallet_switchEthereumChain failed', switchError)
              // do not disconnect automatically; leave wallet connected so user can take action
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
  // Attempt to notify Farcaster Mini App host that our app is ready.
  // Some miniapp hosts inject an SDK on `window` (or expose it via other globals).
  // Calling `sdk.actions.ready()` hides the splash screen. This is intentionally
  // defensive: we only call it if an SDK is present so builds won't break.
  React.useEffect(() => {
    try {
      const maybeSdk = (window as any).sdk || (window as any).farcaster || (window as any).Farcaster || (window as any).__farcaster_sdk || (window as any).miniAppSdk
      if (maybeSdk && maybeSdk.actions && typeof maybeSdk.actions.ready === 'function') {
        // call and ignore result
        maybeSdk.actions.ready().catch((e: any) => console.warn('farcaster sdk ready() rejected', e))
      } else {
        // If the global SDK isn't available, try to find common aliases on window
        // or leave it to the host. No-op if nothing found.
      }
    } catch (e) {
      console.warn('Error while attempting to call Farcaster sdk.ready()', e)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkGuard>
          <div style={{ position: 'relative' }}>
            {children}
          </div>
        </NetworkGuard>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
