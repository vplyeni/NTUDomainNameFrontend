'use client'

import { useState, useCallback, memo, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { DomainCard } from '@/components/DomainCard'
import { Loader2, Wallet, ArrowRightLeft, RotateCw, Send, Globe, User } from 'lucide-react'
import { parseEther, isAddress } from 'viem'

type RecipientType = 'unknown' | 'domain' | 'address'

export default function MyDomainsPage() {
  const { address, isConnected } = useAccount()
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [transferAddress, setTransferAddress] = useState('')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [renewalFee, setRenewalFee] = useState('')
  const [transferError, setTransferError] = useState('')

  const { writeContract, data: hash, isPending, reset: resetTransaction } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Cleanup function to reset modal state
  const handleCloseTransferModal = useCallback(() => {
    setShowTransferModal(false)
    // Reset state after modal animation completes
    setTimeout(() => {
      setTransferAddress('')
      setTransferError('')
      resetTransaction()
    }, 300)
  }, [resetTransaction])

  const handleCloseRenewModal = useCallback(() => {
    setShowRenewModal(false)
    // Reset state after modal animation completes
    setTimeout(() => {
      resetTransaction()
    }, 300)
  }, [resetTransaction])

  // Detect recipient type (domain or address)
  const recipientType: RecipientType = useMemo(() => {
    if (!transferAddress) return 'unknown'
    
    const trimmed = transferAddress.trim()
    
    // Check if it's a domain name (ends with .ntu)
    if (trimmed.toLowerCase().endsWith('.ntu')) {
      return 'domain'
    }
    
    // Check if it's an address (0x + 40 hex chars)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    if (addressRegex.test(trimmed)) {
      return 'address'
    }
    
    // Check if it's 40 hex chars without 0x prefix
    if (/^[a-fA-F0-9]{40}$/.test(trimmed)) {
      return 'address'
    }
    
    return 'unknown'
  }, [transferAddress])

  // Resolve domain to address if input is a domain
  const { data: resolvedAddress, isLoading: isResolving } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'resolve',
    args: recipientType === 'domain' ? [transferAddress.trim()] : undefined,
    query: {
      enabled: recipientType === 'domain' && transferAddress.trim().length > 0
    }
  })

  // Get user's domains
  const { data: userDomains, isLoading: isLoadingDomains, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'reverseResolve',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  // Get domain metadata for selected domain
  const { data: selectedDomainMeta } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'domainMeta',
    args: selectedDomain ? [selectedDomain] : undefined,
    query: {
      enabled: !!selectedDomain
    }
  })

  const handleTransfer = useCallback(async () => {
    setTransferError('')
    
    if (!selectedDomain || !transferAddress.trim()) {
      setTransferError('Please enter a recipient')
      return
    }

    if (recipientType === 'unknown') {
      setTransferError('Invalid recipient. Must be a .ntu domain or Ethereum address')
      return
    }

    let finalAddress: string

    // If input is a domain, use the resolved address
    if (recipientType === 'domain') {
      if (isResolving) {
        setTransferError('Resolving domain...')
        return
      }
      
      if (!resolvedAddress || resolvedAddress === '0x0000000000000000000000000000000000000000') {
        setTransferError('Domain not registered or has no owner')
        return
      }
      
      finalAddress = resolvedAddress
    } else {
      // It's an address, validate and use it
      let addrToValidate = transferAddress.trim()
      if (!addrToValidate.startsWith('0x')) {
        addrToValidate = '0x' + addrToValidate
      }
      
      if (!isAddress(addrToValidate)) {
        setTransferError('Invalid Ethereum address')
        return
      }
      
      finalAddress = addrToValidate
    }
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'transferDomain',
      args: [selectedDomain, finalAddress as `0x${string}`]
    })
  }, [selectedDomain, transferAddress, recipientType, resolvedAddress, isResolving, writeContract])

  const handleRenew = useCallback(async () => {
    if (!selectedDomain || !renewalFee) return
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NNS_ABI,
      functionName: 'renewDomain',
      args: [selectedDomain],
      value: parseEther(renewalFee)
    })
  }, [selectedDomain, renewalFee, writeContract])

  const openTransferModal = useCallback((domain: string) => {
    setSelectedDomain(domain)
    setShowTransferModal(true)
    setTransferAddress('')
    setTransferError('')
  }, [])

  const openRenewModal = useCallback((domain: string, lastBidAmount: bigint) => {
    setSelectedDomain(domain)
    setRenewalFee((Number(lastBidAmount) / 1e18).toString())
    setShowRenewModal(true)
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Wallet className="mb-4 h-16 w-16 text-zinc-400" />
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Connect Your Wallet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please connect your wallet to view your domains
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
            My Domains
          </h1>
          <p className="mt-2 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Manage your registered .ntu domains
          </p>
        </motion.div>

        {/* Domains Grid */}
        {isLoadingDomains ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : userDomains && userDomains.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {userDomains.map((domain, index) => (
              <DomainMetaCard
                key={domain}
                domain={domain}
                index={index}
                onTransfer={openTransferModal}
                onRenew={openRenewModal}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Send className="mb-4 h-16 w-16 text-zinc-400" />
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              No Domains Yet
            </h2>
            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              You don't own any domains yet. Start by searching for your perfect domain!
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

        {/* Transfer Modal */}
        <AnimatePresence>
          {showTransferModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => (isConfirmed || (!isPending && !isConfirming)) && handleCloseTransferModal()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/20">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      Transfer Domain
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedDomain}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Recipient
                    </label>
                    {recipientType !== 'unknown' && transferAddress ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {recipientType === 'domain' ? (
                          <>
                            <Globe className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            <span className="text-purple-600 dark:text-purple-400">Domain Name</span>
                          </>
                        ) : (
                          <>
                            <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-600 dark:text-blue-400">Address</span>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => {
                      setTransferAddress(e.target.value)
                      setTransferError('')
                    }}
                    placeholder="alice.ntu or 0x..."
                    disabled={isPending || isConfirming || isConfirmed}
                    className={`w-full rounded-xl border ${
                      transferAddress && recipientType === 'unknown'
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-700'
                        : recipientType === 'domain'
                        ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500/10 dark:border-purple-700'
                        : recipientType === 'address'
                        ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-blue-700'
                        : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-zinc-700'
                    } bg-white px-4 py-3 text-zinc-900 focus:outline-none focus:ring-4 dark:bg-zinc-800 dark:text-zinc-50 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:disabled:bg-zinc-900`}
                  />
                  {recipientType === 'domain' && resolvedAddress && resolvedAddress !== '0x0000000000000000000000000000000000000000' ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
                    >
                      <User className="h-3 w-3" />
                      Resolves to: {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
                    </motion.p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Enter a .ntu domain name or Ethereum address
                  </p>
                </div>

                {transferError ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl bg-red-50 p-3 dark:bg-red-950/20"
                  >
                    <p className="text-sm text-red-800 dark:text-red-400">
                      ❌ {transferError}
                    </p>
                  </motion.div>
                ) : null}

                <div className="flex gap-3">
                  {!isConfirmed ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !isPending && !isConfirming && handleCloseTransferModal()}
                        disabled={isPending || isConfirming}
                        className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleTransfer}
                        disabled={!transferAddress || recipientType === 'unknown' || isPending || isConfirming || isResolving}
                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                      >
                        {isPending || isConfirming ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </span>
                        ) : isResolving ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Resolving...
                          </span>
                        ) : (
                          'Transfer'
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseTransferModal}
                      className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      Close
                    </motion.button>
                  )}
                </div>

                {isConfirmed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 rounded-xl bg-green-50 p-3 dark:bg-green-950/20"
                  >
                    <p className="text-sm text-green-800 dark:text-green-400">
                      ✅ Domain transferred successfully!
                    </p>
                  </motion.div>
                ) : null}

                {/* Info about transfer capabilities */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20"
                >
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    <strong>💡 Tip:</strong> You can transfer to another domain name! The domain will be transferred to the owner of that domain automatically.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Renew Modal */}
        <AnimatePresence>
          {showRenewModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => (isConfirmed || (!isPending && !isConfirming)) && handleCloseRenewModal()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/20">
                    <RotateCw className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      Renew Domain
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedDomain}
                    </p>
                  </div>
                </div>

                <div className="mb-6 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-950/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    <strong>Renewal Fee:</strong> {renewalFee} ETH
                  </p>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-500">
                    This is the same amount as your original winning bid.
                  </p>
                </div>

                <div className="flex gap-3">
                  {!isConfirmed ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !isPending && !isConfirming && handleCloseRenewModal()}
                        disabled={isPending || isConfirming}
                        className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRenew}
                        disabled={isPending || isConfirming}
                        className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                      >
                        {isPending || isConfirming ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          'Renew'
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseRenewModal}
                      className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      Close
                    </motion.button>
                  )}
                </div>

                {isConfirmed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 rounded-xl bg-green-50 p-3 dark:bg-green-950/20"
                  >
                    <p className="text-sm text-green-800 dark:text-green-400">
                      ✅ Domain renewed successfully!
                    </p>
                  </motion.div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Component to fetch and display domain metadata - memoized for performance
const DomainMetaCard = memo(function DomainMetaCard({ 
  domain, 
  index, 
  onTransfer, 
  onRenew 
}: { 
  domain: string
  index: number
  onTransfer: (domain: string) => void
  onRenew: (domain: string, lastBidAmount: bigint) => void
}) {
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
  const now = mounted ? Math.floor(Date.now() / 1000) : Number(expiryDate)
  const isExpired = Number(expiryDate) < now
  const canRenew = isExpired && (now <= Number(expiryDate) + 90 * 24 * 60 * 60) // within 90 day grace period

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {domain}
        </h3>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Status:</span>
            <span className={`font-medium ${!isExpired ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {!isExpired ? 'Active' : 'Expired'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Expires:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {new Date(Number(expiryDate) * 1000).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTransfer(domain)}
            className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            <ArrowRightLeft className="mx-auto h-4 w-4" />
          </motion.button>
          {canRenew ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRenew(domain, lastBidAmount)}
              className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
            >
              <RotateCw className="mx-auto h-4 w-4" />
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
})

