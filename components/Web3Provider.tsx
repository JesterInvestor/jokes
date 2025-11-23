'use client'

import React, { ReactNode, useEffect } from 'react'
import { WagmiProvider, useAccount, useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient, networks } from '@/lib/config'

const CELO_SEPOLIA_CHAIN_ID = 11142220

function NetworkGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (!isConnected) return
    // If already on Celo Sepolia, nothing to do
    if (chain?.id === CELO_SEPOLIA_CHAIN_ID) return

    // Try to use wagmi's switchNetwork helper first
    if (switchNetwork) {
      try {
        switchNetwork(CELO_SEPOLIA_CHAIN_ID)
        return
      } catch (e) {
        console.warn('switchNetwork failed', e)
      }
    }

    // Fallback: attempt to request the wallet to switch/add the chain
    const provider = (window as any).ethereum
    if (provider && provider.request) {
      const hexChainId = '0x' + CELO_SEPOLIA_CHAIN_ID.toString(16)
      provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChainId }] })
        .catch((switchError: any) => {
          // 4902: chain not found — try to add
          if (switchError && switchError.code === 4902) {
            const sepoliaNetwork = networks?.[0]
            const rpc = sepoliaNetwork?.rpcUrl || 'https://rpc.ankr.com/celo_sepolia'
            provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: hexChainId,
                chainName: 'Celo Sepolia',
                nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
                rpcUrls: [rpc],
                blockExplorerUrls: ['https://explorer.celo.org/sepolia']
              }]
            }).catch((addError: any) => {
              console.warn('wallet_addEthereumChain failed', addError)
              // If we can't switch or add, disconnect to prevent usage on wrong chain
              try { disconnect() } catch (e) {}
            })
          } else {
            console.warn('wallet_switchEthereumChain failed', switchError)
            try { disconnect() } catch (e) {}
          }
        })
    } else {
      // No provider available — nothing to do
    }
  }, [isConnected, chain?.id, switchNetwork, disconnect])

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
