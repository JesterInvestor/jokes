import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'

type Joke = {
  id: number
  content: string
  author: string
  votes: number
  userVote: number | null
}

const ABI = [
  'function totalJokes() view returns (uint256)',
  'function getJoke(uint256) view returns (uint256,address,string,string,int256,bool,bool)',
  'event JokeAdded(uint256 indexed id,address indexed author,string content,string imageUrl)',
  'event Voted(uint256 indexed id,address indexed voter,int8 vote,int256 totalVotes)'
]

function getProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.providers.Web3Provider((window as any).ethereum)
  }
  const rpc = process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC || process.env.NEXT_PUBLIC_RPC_URL
  if (rpc) return new ethers.providers.JsonRpcProvider(rpc)
  return null
}

export function useJokes(contractAddress?: string) {
  const [jokes, setJokes] = useState<Joke[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const addr = contractAddress || process.env.NEXT_PUBLIC_JOKE_VOTING_ADDRESS
    if (!addr) {
      setJokes([])
      setLoading(false)
      return
    }
    const provider = getProvider()
    if (!provider) {
      setJokes([])
      setLoading(false)
      return
    }

    try {
      const contract = new ethers.Contract(addr, ABI, provider)
      const totalRaw = await contract.totalJokes()
      const total = Number(totalRaw.toString())

      const results: Joke[] = []
      for (let i = total; i >= 1; i--) {
        try {
          const res = await contract.getJoke(i)
          // getJoke returns (id, author, content, imageUrl, votes, exists, rewardClaimed)
          const id = Number(res[0].toString())
          const author: string = res[1]
          const content: string = res[2]
          const votes = Number(res[4].toString())
          results.push({ id, content, author, votes, userVote: null })
        } catch (e) {
          // ignore missing or reverted items
        }
      }

      setJokes(results)
    } catch (e) {
      console.warn('useJokes fetch failed', e)
      setJokes([])
    } finally {
      setLoading(false)
    }
  }, [contractAddress])

  useEffect(() => {
    let mounted = true
    fetchAll()

    // subscribe to events for live updates
    const addr = contractAddress || process.env.NEXT_PUBLIC_JOKE_VOTING_ADDRESS
    const provider = getProvider()
    if (!addr || !provider) return

    const contract = new ethers.Contract(addr, ABI, provider)

    const onAdded = (id: any, author: string, content: string) => {
      if (!mounted) return
      const idx = Number(id.toString())
      setJokes(prev => [{ id: idx, content, author, votes: 0, userVote: null }, ...prev])
    }

    const onVoted = (id: any, voter: string, voteVal: any, totalVotes: any) => {
      if (!mounted) return
      const idx = Number(id.toString())
      const tv = Number(totalVotes.toString())
      setJokes(prev => prev.map(j => j.id === idx ? { ...j, votes: tv } : j))
    }

    try {
      contract.on('JokeAdded', onAdded)
      contract.on('Voted', onVoted)
    } catch (e) {
      // ignore
    }

    return () => {
      mounted = false
      try {
        contract.off('JokeAdded', onAdded)
        contract.off('Voted', onVoted)
      } catch (e) {}
    }
  }, [contractAddress, fetchAll])

  return { jokes, loading, refresh: fetchAll }
}

export type { Joke }
