'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

const CELO_SEPOLIA_CHAIN_ID = 11142220

export default function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [currentChain, setCurrentChain] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      setCurrentChain(null)
      return
    }
    const provider = (window as any).ethereum
    if (!provider) return

    let mounted = true
    async function readChain() {
      try {
        let chainHex = provider.chainId || null
        if (!chainHex && provider.request) {
          chainHex = await provider.request({ method: 'eth_chainId' })
        }
        const chain = chainHex ? Number(chainHex) : null
        if (mounted) setCurrentChain(chain)
      } catch (e) {
        // ignore
      }
    }
    readChain()

    function handleChainChanged(chainHex: string) {
      const n = chainHex ? Number(chainHex) : null
      setCurrentChain(n)
    }

    provider?.on?.('chainChanged', handleChainChanged)
    return () => {
      mounted = false
      provider?.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [isConnected])

  if (!isConnected) return null
  if (currentChain === CELO_SEPOLIA_CHAIN_ID) return null

  async function switchToSepolia() {
    setError(null)
    setLoading(true)
    try {
      const provider = (window as any).ethereum
      if (!provider) throw new Error('No injected provider available')
      const hex = '0x' + CELO_SEPOLIA_CHAIN_ID.toString(16)
      try {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] })
        setOk(true)
        return
      } catch (switchError: any) {
        // 4902 = unrecognized chain
        if (switchError && (switchError.code === 4902 || String(switchError).includes('4902'))) {
          // attempt to add
          const rpc = (window as any)?.__REOWN_RPC_OVERRIDE || 'https://rpc.ankr.com/celo_sepolia'
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: hex,
                chainName: 'Celo Sepolia',
                nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
                rpcUrls: [rpc],
                blockExplorerUrls: ['https://explorer.celo.org/sepolia']
              }]
            })
            setOk(true)
            return
          } catch (addErr: any) {
            setError(addErr?.message || String(addErr))
            try { disconnect() } catch (e) {}
          }
        } else {
          setError(switchError?.message || String(switchError))
          try { disconnect() } catch (e) {}
        }
      }
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="paper-card paper-container" style={{ position: 'relative', zIndex: 9999 }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong>Wrong network</strong>
          <div style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.7)' }}>This app only supports the Celo Sepolia network. Please switch your wallet.</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={() => window.location.reload()} disabled={loading}>Refresh</button>
          <button className="btn btn-primary" onClick={switchToSepolia} disabled={loading}>
            {loading ? 'Switching...' : 'Switch to Celo Sepolia'}
          </button>
        </div>
      </div>
      {error && <div style={{ marginTop: '0.75rem', color: '#a33' }}>Error: {error}</div>}
      {ok && <div style={{ marginTop: '0.5rem', color: '#2a7' }}>Switched to Celo Sepolia — please refresh or reconnect.</div>}
    </div>
  )
}
