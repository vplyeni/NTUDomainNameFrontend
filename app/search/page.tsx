'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from '@/components/SearchBar'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { CheckCircle, XCircle, Loader2, AlertCircle, Clock, Gavel, Info } from 'lucide-react'
import { parseEther } from 'viem'
import { 
  generateSecret, 
  generateSecretText,
  hashSecretText,
  makeCommitment, 
  storeBid, 
  getHighestBid, 
  getBidsForDomain,
  type BidData 
} from '@/lib/commitmentUtils'

function SearchContent() {
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const [searchDomain, setSearchDomain] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [step, setStep] = useState<'search' | 'commit' | 'reveal' | 'finalize'>('search')
  const [currentBids, setCurrentBids] = useState<BidData[]>([])
  const [secretText, setSecretText] = useState('')
  const [secretHash, setSecretHash] = useState<`0x${string}`>('0x0000000000000000000000000000000000000000000000000000000000000000')
  const [revealBidAmount, setRevealBidAmount] = useState('')
  const [revealSecretText, setRevealSecretText] = useState('')
  const [revealSecret, setRevealSecret] = useState('')
  const [withdrawDomain, setWithdrawDomain] = useState('')

  // Format ETH amounts without trailing zeros
  const formatETH = useCallback((weiAmount: bigint | number | string): string => {
    const eth = Number(weiAmount) / 1e18
    // Remove trailing zeros and unnecessary decimal point
    return eth.toFixed(4).replace(/\.?0+$/, '') || '0'
  }, [])

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

  // Get auction info
  const { data: auctionInfo, refetch: refetchAuctionInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getAuctionInfo',
    args: searchDomain ? [searchDomain] : undefined,
    query: {
      enabled: !!searchDomain && searchDomain.endsWith('.ntu'),
      refetchInterval: 10000 // Refresh every 10 seconds
    }
  })

  // Get user-specific auction data
  const { data: hasRevealed } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'hasRevealed',
    args: searchDomain && address ? [searchDomain, address] : undefined,
    query: {
      enabled: !!searchDomain && !!address
    }
  })

  const { data: refundableAmount, refetch: refetchRefundable } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getRefundableAmount',
    args: searchDomain && address ? [searchDomain, address] : undefined,
    query: {
      enabled: !!searchDomain && !!address
    }
  })

  // Check if domain is auctionable
  const { data: isAuctionable } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'isAuctionable',
    args: searchDomain ? [searchDomain] : undefined,
    query: {
      enabled: !!searchDomain && searchDomain.endsWith('.ntu')
    }
  })

  useEffect(() => {
    const domain = searchParams.get('domain')
    const phase = searchParams.get('phase')
    
    if (domain) {
      setSearchDomain(domain)
      // Load existing bids for this domain
      const bids = getBidsForDomain(domain)
      setCurrentBids(bids)
      
      // Auto-fill reveal form with highest bid if available
      const highestBid = getHighestBid(domain)
      if (highestBid) {
        setRevealBidAmount(highestBid.bidAmount)
        setRevealSecretText(highestBid.secretText || '')
        setRevealSecret(highestBid.secret)
      }
      
      // Auto-generate secret text for new commits
      const randomText = generateSecretText()
      setSecretText(randomText)
      setSecretHash(hashSecretText(randomText))
      
      // Set step based on phase parameter
      if (phase === 'commit') {
        setStep('commit')
      } else if (phase === 'reveal') {
        setStep('reveal')
      } else if (phase === 'pending_finalization' || phase === 'finalize') {
        setStep('finalize')
      } else {
        // Default to search step
        setStep('search')
      }
    }
  }, [searchParams])

  const handleSearch = useCallback((domain: string) => {
    setSearchDomain(domain)
    setStep('search')
    refetchAvailability()
    refetchMeta()
    
    // Load existing bids for this domain
    const bids = getBidsForDomain(domain)
    setCurrentBids(bids)
    
    // Auto-fill reveal form with highest bid if available
    const highestBid = getHighestBid(domain)
    if (highestBid) {
      setRevealBidAmount(highestBid.bidAmount)
      setRevealSecretText(highestBid.secretText || '')
      setRevealSecret(highestBid.secret)
    }
    
    // Auto-generate secret text for new commits
    const randomText = generateSecretText()
    setSecretText(randomText)
    setSecretHash(hashSecretText(randomText))
  }, [refetchAvailability, refetchMeta])

  const startAuction = useCallback(async () => {
    if (!searchDomain) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'startAuction',
      args: [searchDomain]
    })
  }, [searchDomain, writeContract])

  const commitBid = useCallback(async () => {
    if (!searchDomain || !bidAmount || !address || !secretHash) return
    
    // Use the secretHash (bytes32) for the commitment
    const secret = secretHash
    
    // Calculate commitment hash using proper abi.encode matching
    const commitment = makeCommitment(
      searchDomain,
      bidAmount,
      secret,
      address
    )
    
    // Save bid data to localStorage (including original text)
    const bidData: BidData = {
      domain: searchDomain,
      bidAmount,
      secretText: secretText, // Store the original text
      secret: secretHash, // Store the bytes32 hash
      commitment,
      timestamp: Date.now()
    }
    storeBid(bidData)
    
    // Update current bids display
    const updatedBids = getBidsForDomain(searchDomain)
    setCurrentBids(updatedBids)
    
    // Generate new secret for next bid
    const newText = generateSecretText()
    setSecretText(newText)
    setSecretHash(hashSecretText(newText))
    
    // Call contract with just the commitment hash (no domain name!)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'commitBid',
      args: [commitment],
      value: parseEther(bidAmount)
    })
  }, [searchDomain, bidAmount, address, secretText, secretHash, writeContract])

  const revealBid = useCallback(async () => {
    if (!searchDomain || !revealBidAmount || !revealSecret) {
      alert('Please enter bid amount and secret')
      return
    }
    
    // Reveal the bid with the selected amount and secret (use the hash, not the text)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'revealBid',
      args: [searchDomain, parseEther(revealBidAmount), revealSecret as `0x${string}`]
    })
  }, [searchDomain, revealBidAmount, revealSecret, writeContract])
  
  // Handle secret text changes
  const handleSecretTextChange = useCallback((text: string) => {
    setSecretText(text)
    if (text) {
      setSecretHash(hashSecretText(text))
    }
  }, [])
  
  // Handle reveal secret text changes
  const handleRevealSecretTextChange = useCallback((text: string) => {
    setRevealSecretText(text)
    if (text) {
      setRevealSecret(hashSecretText(text))
    }
  }, [])

  const finalizeAuction = useCallback(async () => {
    if (!searchDomain) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'finalize',
      args: [searchDomain]
    })
  }, [searchDomain, writeContract])

  const withdrawFunds = useCallback(async () => {
    if (!searchDomain) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'withdraw',
      args: [searchDomain]
    })
  }, [searchDomain, writeContract])

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

                  {/* Auction Status Info */}
                  {auctionInfo && auctionInfo[0] ? (
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-400">
                        Auction Status
                      </h3>
                      <div className="space-y-1 text-sm text-blue-800 dark:text-blue-500">
                        <div className="flex justify-between">
                          <span>Phase:</span>
                          <span className="font-semibold capitalize">{auctionInfo[7].replace('_', ' ')}</span>
                        </div>
                        {auctionInfo[6] > 0 ? (
                          <div className="flex justify-between">
                            <span>Time Remaining:</span>
                            <span className="font-semibold">
                              {Math.floor(Number(auctionInfo[6]) / 3600)}h {Math.floor((Number(auctionInfo[6]) % 3600) / 60)}m
                            </span>
                          </div>
                        ) : null}
                        {auctionInfo[5] > 0 ? (
                          <div className="flex justify-between">
                            <span>Current Highest Bid:</span>
                            <span className="font-semibold">{formatETH(auctionInfo[5])} ETH</span>
                          </div>
                        ) : null}
                        {address && hasRevealed ? (
                          <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-800 flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>You have revealed your bid</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Refund/Withdrawal Section */}
                  {address && refundableAmount && Number(formatETH(refundableAmount)) > 0 ? 
                  (
                    <>
                      {auctionInfo && auctionInfo[1] ? (
                        // Auction is finalized - show withdraw button
                        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="mb-1 text-sm font-semibold text-amber-900 dark:text-amber-400">
                                Funds Available to Withdraw
                              </h3>
                              <p className="text-xl font-bold text-amber-900 dark:text-amber-300">
                                {formatETH(refundableAmount)} ETH
                              </p>
                              <p className="mt-1 text-xs text-amber-800 dark:text-amber-500">
                                {auctionInfo[4] === address ? 
                                  'Excess funds from multiple bids (winning bid already deducted)' : 
                                  'Full refund - you did not win this auction'
                                }
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={withdrawFunds}
                              disabled={isPending || isConfirming || isConfirmed}
                              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 transition-all"
                            >
                              {isPending || isConfirming ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Withdrawing...
                                </span>
                              ) : (
                                'Withdraw'
                              )}
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        // Auction not finalized yet - show notice
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-400">
                                Funds Pending Withdrawal
                              </h3>
                              <p className="text-sm text-blue-800 dark:text-blue-500">
                                You have <strong>{formatETH(refundableAmount)} ETH</strong> that will be available for withdrawal once the auction is finalized.
                                {currentBids.length > 1 && ' (Multiple bids detected - excess funds will be refunded)'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}

                  {/* Auctionable Status Warning */}
                  {isAvailable && !isAuctionable && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-400">
                            Domain Not Auctionable
                          </h3>
                          <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-500">
                            This domain is not in the auctionable list. Only the contract owner can add it to enable auctions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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
                  ) : isAvailable && isAuctionable ? (
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
                            disabled={isPending || isConfirming || isConfirmed}
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

                          {/* Important Notice about Multiple Bids */}
                          <div className="rounded-xl bg-blue-50 p-4 border-l-4 border-blue-500 dark:bg-blue-950/20 dark:border-blue-400">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              <div className="text-sm text-blue-900 dark:text-blue-300">
                                <p className="font-semibold mb-1">⚠️ Multiple Bids & Refunds</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400">
                                  <li>You can commit <strong>multiple bids</strong> on the same domain</li>
                                  <li>Only your <strong>HIGHEST bid</strong> will be used during reveal</li>
                                  <li>All funds from non-winning bids are <strong>fully refundable</strong> after auction</li>
                                  <li>Your secret is auto-generated and stored locally</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Show existing bids */}
                          {currentBids.length > 0 && (
                            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                Your Committed Bids ({currentBids.length})
                              </h4>
                              <div className="space-y-2">
                                {currentBids.map((bid, idx) => (
                                  <div key={bid.commitment} className="flex items-center justify-between text-xs bg-white dark:bg-zinc-900 rounded-lg p-2">
                                    <span className="text-zinc-600 dark:text-zinc-400">Bid #{idx + 1}</span>
                                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{bid.bidAmount} ETH</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
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

                          {/* Secret Text Input */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Secret Text (human-readable)
                            </label>
                            <input
                              type="text"
                              value={secretText}
                              onChange={(e) => handleSecretTextChange(e.target.value)}
                              placeholder="Enter your secret phrase..."
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Enter a memorable secret phrase. This will be hashed automatically.
                            </p>
                          </div>

                          {/* Secret Hash Input (auto-filled but editable) */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Secret Hash (bytes32)
                            </label>
                            <input
                              type="text"
                              value={secretHash}
                              onChange={(e) => setSecretHash(e.target.value as `0x${string}`)}
                              placeholder="0x..."
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Auto-generated from text above. Can be manually edited if needed.
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={commitBid}
                            disabled={!bidAmount || isPending || isConfirming || isConfirmed}
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

                          {/* Auto-fill notice */}
                          {currentBids.length > 0 && (
                            <div className="rounded-xl bg-green-50 p-4 border-l-4 border-green-500 dark:bg-green-950/20 dark:border-green-400">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-green-900 dark:text-green-300">
                                  <p className="font-semibold mb-1">✅ Auto-filled with Highest Bid</p>
                                  <p className="text-green-800 dark:text-green-400">
                                    We've automatically filled in your <strong>highest bid</strong> ({getHighestBid(searchDomain)?.bidAmount} ETH) and its secret. You can reveal it now or manually edit if needed.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Bid Amount Input */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Bid Amount to Reveal (ETH)
                            </label>
                            <input
                              type="number"
                              step="0.001"
                              value={revealBidAmount}
                              onChange={(e) => setRevealBidAmount(e.target.value)}
                              placeholder="0.1"
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                          </div>

                          {/* Secret Text Input */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Secret Text (from commit phase)
                            </label>
                            <input
                              type="text"
                              value={revealSecretText}
                              onChange={(e) => handleRevealSecretTextChange(e.target.value)}
                              placeholder="Enter your secret phrase..."
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Enter the same secret text you used during commit.
                            </p>
                          </div>

                          {/* Secret Hash Input */}
                          <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Secret Hash (bytes32)
                            </label>
                            <input
                              type="text"
                              value={revealSecret}
                              onChange={(e) => setRevealSecret(e.target.value)}
                              placeholder="0x..."
                              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Auto-generated from text above. Can be manually edited if needed.
                            </p>
                          </div>

                          {/* Bid selector if multiple bids */}
                          {currentBids.length > 1 && (
                            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                Or Select a Different Bid:
                              </h4>
                              <div className="space-y-2">
                                {currentBids.map((bid, idx) => (
                                  <button
                                    key={bid.commitment}
                                    onClick={() => {
                                      setRevealBidAmount(bid.bidAmount)
                                      setRevealSecretText(bid.secretText || '')
                                      setRevealSecret(bid.secret)
                                    }}
                                    className="w-full flex items-center justify-between text-sm bg-white dark:bg-zinc-900 rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                                  >
                                    <span className="text-zinc-600 dark:text-zinc-400">Bid #{idx + 1}</span>
                                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{bid.bidAmount} ETH</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={revealBid}
                            disabled={!revealBidAmount || !revealSecret || isPending || isConfirming || isConfirmed}
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
                            disabled={isPending || isConfirming || isConfirmed}
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

