'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from '@/components/SearchBar'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { CheckCircle, XCircle, Loader2, AlertCircle, Clock, Gavel } from 'lucide-react'
import { parseEther, keccak256, toBytes } from 'viem'

function SearchContent() {
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const [searchDomain, setSearchDomain] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [secret, setSecret] = useState('')
  const [step, setStep] = useState<'search' | 'commit' | 'reveal' | 'finalize'>('search')
  const [savedBidData, setSavedBidData] = useState<{ domain: string; bidAmount: string; secret: string } | null>(null)

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Check domain availability
  const { data: isAvailable, isLoading: isCheckingAvailability, refetch: refetchAvailability } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'available',
    args: searchDomain ? [searchDomain] : undefined,
    query: {
      enabled: !!searchDomain && searchDomain.endsWith('.ntu')
    }
  })

  // Get domain metadata
  const { data: domainMeta, refetch: refetchMeta } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'domainMeta',
    args: searchDomain ? [searchDomain] : undefined,
    query: {
      enabled: !!searchDomain && searchDomain.endsWith('.ntu')
    }
  })

  useEffect(() => {
    const domain = searchParams.get('domain')
    if (domain) {
      setSearchDomain(domain)
    }
  }, [searchParams])

  // Generate random secret
  const generateSecret = () => {
    const randomBytes = new Uint8Array(32)
    crypto.getRandomValues(randomBytes)
    return '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSearch = (domain: string) => {
    setSearchDomain(domain)
    setStep('search')
    refetchAvailability()
    refetchMeta()
  }

  const startAuction = async () => {
    if (!searchDomain) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'startAuction',
      args: [searchDomain]
    })
  }

  const commitBid = async () => {
    if (!searchDomain || !bidAmount || !address) return
    
    const generatedSecret = generateSecret()
    setSecret(generatedSecret)
    
    // Calculate commitment hash
    const commitment = keccak256(
      toBytes(searchDomain + bidAmount + generatedSecret + address)
    )
    
    // Save bid data for reveal phase
    const bidData = { domain: searchDomain, bidAmount, secret: generatedSecret }
    setSavedBidData(bidData)
    localStorage.setItem('nns_bid_data', JSON.stringify(bidData))
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'commitBid',
      args: [searchDomain, commitment],
      value: parseEther(bidAmount)
    })
  }

  const revealBid = async () => {
    if (!savedBidData) {
      // Try to load from localStorage
      const stored = localStorage.getItem('nns_bid_data')
      if (stored) {
        const data = JSON.parse(stored)
        setSavedBidData(data)
        
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: NNS_ABI,
          functionName: 'revealBid',
          args: [data.domain, parseEther(data.bidAmount), data.secret as `0x${string}`]
        })
      }
      return
    }
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'revealBid',
      args: [savedBidData.domain, parseEther(savedBidData.bidAmount), savedBidData.secret as `0x${string}`]
    })
  }

  const finalizeAuction = async () => {
    if (!searchDomain) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'finalize',
      args: [searchDomain]
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-8 text-center text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Find Your Perfect Domain
          </h1>
          <SearchBar onSearch={handleSearch} autoFocus />
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {searchDomain && (
            <motion.div
              key={searchDomain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {isCheckingAvailability ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div>
                  {/* Domain Status */}
                  <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {searchDomain}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Domain name
                      </p>
                    </div>
                    {isAvailable ? (
                      <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700 dark:bg-red-950/20 dark:text-red-400">
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">Not Available</span>
                      </div>
                    )}
                  </div>

                  {/* Action Section */}
                  {!isConnected ? (
                    <div className="rounded-xl bg-yellow-50 p-6 dark:bg-yellow-950/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                        <div>
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-400">
                            Connect Your Wallet
                          </h3>
                          <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-500">
                            Please connect your wallet to start an auction or place a bid
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isAvailable ? (
                    <div className="space-y-6">
                      {/* Step Indicators */}
                      <div className="flex items-center justify-center gap-4">
                        {['Start Auction', 'Commit Bid', 'Reveal Bid', 'Finalize'].map((label, i) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['search', 'commit', 'reveal', 'finalize'][i] === step
                                ? 'bg-blue-500 text-white'
                                : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                            } text-sm font-semibold`}>
                              {i + 1}
                            </div>
                            {i < 3 && <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />}
                          </div>
                        ))}
                      </div>

                      {/* Start Auction */}
                      {step === 'search' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-950/20">
                            <div className="flex items-start gap-3">
                              <Gavel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                                  Start Blind Auction
                                </h3>
                                <p className="mt-1 text-sm text-blue-800 dark:text-blue-500">
                                  Initiate a blind auction for this domain. The auction has two phases: commit and reveal.
                                </p>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startAuction}
                            disabled={isPending || isConfirming}
                            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-lg font-semibold text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                          >
                            {isPending || isConfirming ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Start Auction'
                            )}
                          </motion.button>
                          {isConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20"
                            >
                              <p className="text-sm text-green-800 dark:text-green-400">
                                ✅ Auction started! You can now commit your bid.
                              </p>
                              <button
                                onClick={() => setStep('commit')}
                                className="mt-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                              >
                                Continue to Commit Bid →
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Commit Bid */}
                      {step === 'commit' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="rounded-xl bg-purple-50 p-6 dark:bg-purple-950/20">
                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-400">
                                  Commit Phase
                                </h3>
                                <p className="mt-1 text-sm text-purple-800 dark:text-purple-500">
                                  Place your sealed bid. Your bid amount will be hidden until the reveal phase.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Bid Amount (ETH)
                            </label>
                            <input
                              type="number"
                              step="0.001"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder="0.1"
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={commitBid}
                            disabled={!bidAmount || isPending || isConfirming}
                            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4 text-lg font-semibold text-white hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 transition-all"
                          >
                            {isPending || isConfirming ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Commit Bid'
                            )}
                          </motion.button>
                          {isConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20"
                            >
                              <p className="text-sm text-green-800 dark:text-green-400">
                                ✅ Bid committed! Wait for the commit phase to end, then reveal your bid.
                              </p>
                              <button
                                onClick={() => setStep('reveal')}
                                className="mt-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                              >
                                Continue to Reveal Phase →
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Reveal Bid */}
                      {step === 'reveal' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="rounded-xl bg-orange-50 p-6 dark:bg-orange-950/20">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              <div>
                                <h3 className="font-semibold text-orange-900 dark:text-orange-400">
                                  Reveal Phase
                                </h3>
                                <p className="mt-1 text-sm text-orange-800 dark:text-orange-500">
                                  Reveal your bid to compete for the domain. Make sure the commit phase has ended.
                                </p>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={revealBid}
                            disabled={isPending || isConfirming}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-semibold text-white hover:from-orange-600 hover:to-red-700 disabled:opacity-50 transition-all"
                          >
                            {isPending || isConfirming ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Reveal Bid'
                            )}
                          </motion.button>
                          {isConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20"
                            >
                              <p className="text-sm text-green-800 dark:text-green-400">
                                ✅ Bid revealed! Wait for the reveal phase to end to finalize the auction.
                              </p>
                              <button
                                onClick={() => setStep('finalize')}
                                className="mt-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
                              >
                                Continue to Finalize →
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Finalize */}
                      {step === 'finalize' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="rounded-xl bg-green-50 p-6 dark:bg-green-950/20">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <div>
                                <h3 className="font-semibold text-green-900 dark:text-green-400">
                                  Finalize Auction
                                </h3>
                                <p className="mt-1 text-sm text-green-800 dark:text-green-500">
                                  Complete the auction and assign the domain to the winner.
                                </p>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={finalizeAuction}
                            disabled={isPending || isConfirming}
                            className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-lg font-semibold text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                          >
                            {isPending || isConfirming ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Finalize Auction'
                            )}
                          </motion.button>
                          {isConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="rounded-xl bg-green-50 p-4 dark:bg-green-950/20"
                            >
                              <p className="text-sm text-green-800 dark:text-green-400">
                                ✅ Auction finalized! The domain has been assigned to the winner.
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Error Display */}
                      {isError && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl bg-red-50 p-4 dark:bg-red-950/20"
                        >
                          <p className="text-sm text-red-800 dark:text-red-400">
                            ❌ Error: {error?.message || 'Transaction failed'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-800/50">
                      <p className="text-center text-zinc-600 dark:text-zinc-400">
                        This domain is already registered or in an active auction
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

