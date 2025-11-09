'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { Loader2, Lock, Unlock, AlertCircle, CheckCircle, X } from 'lucide-react'
import { getAllBids, removeBid, type BidData } from '@/lib/commitmentUtils'

export default function CommitmentsPage() {
  const { address, isConnected } = useAccount()
  const [localBids, setLocalBids] = useState<BidData[]>(getAllBids())

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Get unrevealed commitments from contract
  const { data: unrevealedCommitments, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getUserUnrevealedCommitments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000 // Refresh every 10 seconds
    }
  })

  const formatETH = useCallback((weiAmount: bigint | number | string): string => {
    const eth = Number(weiAmount) / 1e18
    return eth.toFixed(4).replace(/\.?0+$/, '') || '0'
  }, [])

  const formatDate = useCallback((timestamp: number | bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString()
  }, [])

  const cancelCommitment = useCallback(async (commitmentHash: string) => {
    if (!commitmentHash) return
    
    // Find the local bid to remove from localStorage after cancellation
    const bidToRemove = localBids.find(bid => bid.commitment === commitmentHash)
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'cancelCommitment',
      args: [commitmentHash as `0x${string}`]
    })

    // Remove from localStorage after transaction succeeds
    if (bidToRemove) {
      removeBid(commitmentHash)
      setLocalBids(getAllBids())
    }
  }, [writeContract, localBids])

  const commitments = unrevealedCommitments?.[0] || []
  const values = unrevealedCommitments?.[1] || []
  const timestamps = unrevealedCommitments?.[2] || []

  // Match local bids with on-chain commitments
  const enrichedCommitments = commitments.map((hash: string, idx: number) => {
    const localBid = localBids.find(bid => bid.commitment === hash)
    return {
      hash,
      value: values[idx],
      timestamp: timestamps[idx],
      domain: localBid?.domain || 'Unknown',
      bidAmount: localBid?.bidAmount || formatETH(values[idx]),
      secretText: localBid?.secretText || ''
    }
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 dark:border-yellow-900 dark:bg-yellow-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-400">
                  Connect Your Wallet
                </h3>
                <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-500">
                  Please connect your wallet to view and manage your commitments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                My Commitments
              </h1>
              <p className="mt-1 text-base md:text-lg text-zinc-600 dark:text-zinc-400">
                Manage your unrevealed auction commitments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                About Commitments
              </h3>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-500">
                These are your unrevealed commitments. You can cancel them at any time before revealing to get your funds back. 
                Once revealed, funds are locked until the auction finalizes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Commitments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : enrichedCommitments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {enrichedCommitments.map((commitment: any, index: number) => (
              <motion.div
                key={commitment.hash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          {commitment.domain}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Committed on {formatDate(commitment.timestamp)}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/20 dark:text-purple-400">
                        <Lock className="h-3 w-3" />
                        Unrevealed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between sm:block">
                        <span className="text-zinc-600 dark:text-zinc-400">Locked Value:</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-50 sm:block">
                          {formatETH(commitment.value)} ETH
                        </span>
                      </div>
                      {commitment.secretText && (
                        <div className="flex justify-between sm:block">
                          <span className="text-zinc-600 dark:text-zinc-400">Secret:</span>
                          <span className="font-mono text-xs text-zinc-900 dark:text-zinc-50 sm:block">
                            {commitment.secretText}
                          </span>
                        </div>
                      )}
                    </div>

                    <details className="text-xs">
                      <summary className="cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">
                        Show commitment hash
                      </summary>
                      <code className="mt-2 block rounded bg-zinc-100 p-2 font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 break-all">
                        {commitment.hash}
                      </code>
                    </details>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => cancelCommitment(commitment.hash)}
                    disabled={isPending || isConfirming}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-4 py-3 font-semibold text-white hover:from-red-600 hover:to-pink-700 disabled:opacity-50 transition-all lg:w-auto"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Cancel & Refund
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Unlock className="mb-4 h-16 w-16 text-zinc-400" />
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              No Active Commitments
            </h2>
            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              You don't have any unrevealed commitments at the moment.
            </p>
            <motion.a
              href="/auctions"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Browse Auctions
            </motion.a>
          </motion.div>
        )}

        {/* Transaction Status */}
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-xl bg-green-50 p-4 dark:bg-green-950/20"
          >
            <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Commitment cancelled successfully! Your funds have been refunded.
              </p>
            </div>
          </motion.div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-xl bg-red-50 p-4 dark:bg-red-950/20"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Error: {error?.message || 'Transaction failed'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

