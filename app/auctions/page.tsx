'use client'

import { memo, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { Loader2, Gavel, TrendingUp, Filter, Clock, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type PhaseFilter = 'all' | 'commit' | 'reveal' | 'pending_finalization' | 'finalized'

export default function AuctionsPage() {
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all')
  
  // Get auctionable domains and filter by phase
  const { data: searchResults, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'searchAuctions',
    args: [phaseFilter],
    query: {
      refetchInterval: 10000 // Refresh every 10 seconds
    }
  })

  const domains = searchResults?.[0] || []
  const timeRemaining = searchResults?.[1] || []

  const phaseOptions: { value: PhaseFilter; label: string; icon: any; color: string }[] = [
    { value: 'all', label: 'All Auctions', icon: Gavel, color: 'blue' },
    { value: 'commit', label: 'Commit Phase', icon: Clock, color: 'purple' },
    { value: 'reveal', label: 'Reveal Phase', icon: Eye, color: 'orange' },
    { value: 'pending_finalization', label: 'Pending Finalization', icon: AlertCircle, color: 'amber' },
    { value: 'finalized', label: 'Finalized', icon: CheckCircle, color: 'green' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Active Auctions
              </h1>
              <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
                Browse and participate in ongoing domain auctions
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
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                How Blind Auctions Work
              </h3>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-500">
                Our blind auction system ensures fairness. During the commit phase, you submit a sealed bid. 
                In the reveal phase, you reveal your bid amount. The highest bidder wins after finalization.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Phase Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Filter by Phase
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {phaseOptions.map(({ value, label, icon: Icon }) => {
              const isActive = phaseFilter === value
              return (
                <button
                  key={value}
                  onClick={() => setPhaseFilter(value)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all ${
                    isActive
                      ? value === 'all' ? 'bg-blue-500 text-white shadow-lg' :
                        value === 'commit' ? 'bg-purple-500 text-white shadow-lg' :
                        value === 'reveal' ? 'bg-orange-500 text-white shadow-lg' :
                        value === 'pending_finalization' ? 'bg-amber-500 text-white shadow-lg' :
                        'bg-green-500 text-white shadow-lg'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Auctions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : domains && domains.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {domains.map((domain, index) => (
              <AuctionCard 
                key={domain} 
                domain={domain} 
                timeRemainingSeconds={Number(timeRemaining[index])}
                index={index} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Gavel className="mb-4 h-16 w-16 text-zinc-400" />
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              No Auctions Found
            </h2>
            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              {phaseFilter === 'all' 
                ? 'No active auctions at the moment. Start one from the search page!'
                : `No auctions in ${phaseFilter.replace('_', ' ')} phase.`
              }
            </p>
            <motion.a
              href="/search"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Search Domains
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Component to display individual auction card with detailed info
const AuctionCard = memo(function AuctionCard({ 
  domain, 
  timeRemainingSeconds,
  index 
}: { 
  domain: string
  timeRemainingSeconds: number
  index: number 
}) {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Get detailed auction info
  const { data: auctionInfo, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getAuctionInfo',
    args: [domain],
    query: {
      refetchInterval: 10000 // Refresh every 10 seconds
    }
  })

  // Get user-specific info if connected
  const { data: hasRevealed } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'hasRevealed',
    args: address ? [domain, address] : undefined,
    query: {
      enabled: !!address
    }
  })

  const { data: refundableAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getRefundableAmount',
    args: address ? [domain, address] : undefined,
    query: {
      enabled: !!address
    }
  })

  const formatAddress = useCallback((addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`, [])
  
  const formatTime = useCallback((seconds: number) => {
    if (seconds === 0) return 'Ended'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }, [])

  // Format ETH amounts without trailing zeros
  const formatETH = useCallback((weiAmount: bigint | number | string): string => {
    const eth = Number(weiAmount) / 1e18
    // Remove trailing zeros and unnecessary decimal point
    return eth.toFixed(4).replace(/\.?0+$/, '') || '0'
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!auctionInfo) return null

  const [exists, finalized, commitEnd, revealEnd, highestBidder, highestBid, timeRemaining, phase] = auctionInfo

  // Phase styling
  const phaseConfig = {
    commit: { bg: 'bg-purple-100 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/50', icon: Clock },
    reveal: { bg: 'bg-orange-100 dark:bg-orange-950/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500/50', icon: Eye },
    pending_finalization: { bg: 'bg-amber-100 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/50', icon: AlertCircle },
    finalized: { bg: 'bg-green-100 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-500/50', icon: CheckCircle },
    not_started: { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-700 dark:text-zinc-400', border: 'border-zinc-500/50', icon: Gavel }
  }

  const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig.not_started
  const PhaseIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-2xl border ${config.border} bg-white p-6 shadow-sm hover:shadow-xl transition-all dark:bg-zinc-900`}
    >
      <div className={`absolute inset-0 ${config.bg} opacity-50 group-hover:opacity-75 transition-opacity`} />
      
      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {domain}
          </h3>
          <span className={`flex items-center gap-1 rounded-full ${config.bg} px-2.5 py-1 text-xs font-semibold ${config.text}`}>
            <PhaseIcon className="h-3 w-3" />
            {phase.replace('_', ' ')}
          </span>
        </div>

        {/* Auction Details */}
        <div className="mb-4 space-y-2 text-sm">
          {timeRemainingSeconds > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Time Left:</span>
              <span className={`font-bold ${config.text}`}>
                {formatTime(timeRemainingSeconds)}
              </span>
            </div>
          )}
          
          {highestBid > 0 && (
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Highest Bid:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatETH(highestBid)} ETH
              </span>
            </div>
          )}
          
          {highestBidder && highestBidder !== '0x0000000000000000000000000000000000000000' && (
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Leading Bidder:</span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">
                {formatAddress(highestBidder)}
              </span>
            </div>
          )}

          {/* User-specific info */}
          {address && hasRevealed && (
            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                <span>You have revealed your bid</span>
              </div>
            </div>
          )}
          
          {address && refundableAmount && Number(refundableAmount) > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
              <AlertCircle className="h-3 w-3" />
              <span>Refund available: {formatETH(refundableAmount)} ETH</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/search?domain=${encodeURIComponent(domain)}&phase=${phase}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white transition-all ${
              phase === 'commit' ? 'from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700' :
              phase === 'reveal' ? 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' :
              phase === 'pending_finalization' ? 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' :
              'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {phase === 'commit' ? 'Place Bid' :
             phase === 'reveal' ? 'Reveal Bid' :
             phase === 'pending_finalization' ? 'Finalize' :
             'View Details'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
})

