import { useCallback, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers'

// Minimal ABI for the functions we need on JokeVoting
const JokeVotingABI = [
  {
    inputs: [
      { internalType: 'string', name: 'content', type: 'string' },
      { internalType: 'string', name: 'imageUrl', type: 'string' },
    ],
    name: 'addJoke',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'int8', name: 'voteType', type: 'int8' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const DEFAULT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_JOKE_VOTING_ADDRESS

type AddJokeResult = {
  addJoke: (content: string, imageUrl?: string) => Promise<string | undefined>
  isLoading: boolean
  isSuccess: boolean
  error?: unknown
}

export function useAddJoke(contractAddress?: string): AddJokeResult {
  const { address: userAddress, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const target = (contractAddress || DEFAULT_CONTRACT_ADDRESS) as string | undefined

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hookError, setHookError] = useState<unknown | undefined>(undefined)

  const addJoke = useCallback(
    async (content: string, imageUrl = '') => {
      setIsSuccess(false)
      setHookError(undefined)
      if (!isConnected) throw new Error('wallet not connected')
      if (!target) throw new Error('contract address not configured')
      if (!signer) throw new Error('no signer available')

      setIsLoading(true)
      try {
        const contract = new ethers.Contract(target, JokeVotingABI, signer as ethers.Signer)
        const tx = await contract.addJoke(content, imageUrl)
        await tx.wait()
        setIsSuccess(true)
        return tx.hash
      } catch (e) {
        setHookError(e)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, target, signer]
  )

  return { addJoke, isLoading, isSuccess, error: hookError }
}

type VoteResult = {
  vote: (id: number, voteType: 1 | -1) => Promise<string | undefined>
  isLoading: boolean
  isSuccess: boolean
  error?: unknown
}

export function useVote(contractAddress?: string): VoteResult {
  const { address: userAddress, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const target = (contractAddress || DEFAULT_CONTRACT_ADDRESS) as string | undefined

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hookError, setHookError] = useState<unknown | undefined>(undefined)

  const vote = useCallback(
    async (id: number, voteType: 1 | -1) => {
      setIsSuccess(false)
      setHookError(undefined)
      if (!isConnected) throw new Error('wallet not connected')
      if (!target) throw new Error('contract address not configured')
      if (!signer) throw new Error('no signer available')

      setIsLoading(true)
      try {
        const contract = new ethers.Contract(target, JokeVotingABI, signer as ethers.Signer)
        const v = voteType === 1 ? 1 : -1
        const tx = await contract.vote(id, v)
        await tx.wait()
        setIsSuccess(true)
        return tx.hash
      } catch (e) {
        setHookError(e)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, target, signer]
  )

  return { vote, isLoading, isSuccess, error: hookError }
}
