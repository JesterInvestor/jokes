'use client'

import React, { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/lib/config'

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
