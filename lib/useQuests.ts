import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

type Quest = {
  id: number
  title: string
  reward: number
  active: boolean
  eligible: boolean
  claimed: boolean
}

const ABI = [
  'function nextQuestId() view returns (uint256)',
  'function quests(uint256) view returns (uint256,string,uint256,bool)',
  'function eligible(address,uint256) view returns (bool)',
  'function claimed(address,uint256) view returns (bool)',
  'function claim(uint256)'
]

function getProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.providers.Web3Provider((window as any).ethereum)
  }
  const rpc = process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC || process.env.NEXT_PUBLIC_RPC_URL || process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC
  if (rpc) return new ethers.providers.JsonRpcProvider(rpc)
  return null
}

export function useQuests(contractAddress?: string) {
  const { address, isConnected } = useAccount()
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const addr = contractAddress || process.env.NEXT_PUBLIC_QUEST_REGISTRY_ADDRESS
    if (!addr) {
      setQuests([])
      setLoading(false)
      return
    }
    const provider = getProvider()
    if (!provider) {
      setQuests([])
      setLoading(false)
      return
    }

    try {
      const contract = new ethers.Contract(addr, ABI, provider)
      const nextRaw = await contract.nextQuestId()
      const next = Number(nextRaw.toString())
      const results: Quest[] = []
      for (let i = 1; i < next; i++) {
        try {
          const q = await contract.quests(i)
          const id = Number(q[0].toString())
          const title = q[1]
          const reward = Number(q[2].toString())
          const active = Boolean(q[3])
          let eligible = false
          let claimed = false
          if (address) {
            try { eligible = await contract.eligible(address, id) } catch (e) {}
            try { claimed = await contract.claimed(address, id) } catch (e) {}
          }
          results.push({ id, title, reward, active, eligible, claimed })
        } catch (e) {
          // ignore per-quest errors
        }
      }
      setQuests(results)
    } catch (e) {
      console.warn('useQuests refresh failed', e)
      setQuests([])
    } finally {
      setLoading(false)
    }
  }, [contractAddress, address])

  useEffect(() => {
    refresh()
  }, [refresh])

  const claim = useCallback(async (questId: number) => {
    const addr = contractAddress || process.env.NEXT_PUBLIC_QUEST_REGISTRY_ADDRESS
    if (!addr) throw new Error('QuestRegistry address not configured')
    if (!isConnected) throw new Error('wallet not connected')
    if (typeof window === 'undefined' || !(window as any).ethereum) throw new Error('no signer available')
    const web3 = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = web3.getSigner()
    const contract = new ethers.Contract(addr, ABI, signer)
    const tx = await contract.claim(questId)
    await tx.wait()
    // refresh after claim
    await refresh()
    return tx.hash
  }, [contractAddress, isConnected, refresh])

  return { quests, loading, refresh, claim, setQuests }
}

export type { Quest }
