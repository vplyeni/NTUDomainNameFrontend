'use client'

import { memo, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { Loader2, Gavel, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AuctionsPage() {
  // Get all registered domains
  const { data: allDomains, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'allDomains'
  })

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

        {/* Domains List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : allDomains && allDomains.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {allDomains.map((domain, index) => (
              <DomainAuctionCard key={domain} domain={domain} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Gavel className="mb-4 h-16 w-16 text-zinc-400" />
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              No Domains Yet
            </h2>
            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              No domains have been registered yet. Be the first to claim one!
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

// Component to display individual domain auction info - memoized for performance
const DomainAuctionCard = memo(function DomainAuctionCard({ domain, index }: { domain: string; index: number }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const { data: domainMeta, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'domainMeta',
    args: [domain]
  })

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'domainNameOwner',
    args: [domain]
  })

  const formatAddress = useCallback((addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!domainMeta) return null

  const [registrationDate, expiryDate, registrant, lastBidAmount] = domainMeta
  // Only compute time-sensitive values after mounting to prevent hydration errors
  const now = mounted ? Math.floor(Date.now() / 1000) : Number(expiryDate) + 1
  const isActive = Number(expiryDate) >= now

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {domain}
          </h3>
          {isActive ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/20 dark:text-green-400">
              Active
            </span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              Expired
            </span>
          )}
        </div>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Owner:</span>
            <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">
              {owner ? formatAddress(owner as string) : 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Last Bid:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {(Number(lastBidAmount) / 1e18).toFixed(4)} ETH
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Expires:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {new Date(Number(expiryDate) * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>

        <Link href={`/search?domain=${encodeURIComponent(domain)}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-700 transition-all"
          >
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
})

