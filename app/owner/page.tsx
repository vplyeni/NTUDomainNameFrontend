'use client'

import { motion } from 'framer-motion'
import { Crown, Plus, Trash2, Search, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import { useIsOwner } from '@/lib/useIsOwner'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { useState, useCallback, useEffect } from 'react'
import { validateDomainName } from '@/lib/validation'

export default function OwnerPage() {
  const { isConnected } = useAccount()
  const { isOwner, isLoading: isCheckingOwner } = useIsOwner()
  const [domainInput, setDomainInput] = useState('')
  const [batchInput, setBatchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Read all auctionable domains
  const { data: auctionableDomains, refetch: refetchDomains, isLoading: isLoadingDomains } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'getAllAuctionableDomains',
  })

  // Search functionality
  const { data: searchResults, refetch: refetchSearch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'searchAuctionableDomains',
    args: [searchQuery],
  })

  // Write contracts
  const { writeContract: addDomain, data: addHash } = useWriteContract()
  const { writeContract: addBatch, data: batchHash } = useWriteContract()
  const { writeContract: removeDomain, data: removeHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isAddingDomain, isSuccess: isAddSuccess } = useWaitForTransactionReceipt({ hash: addHash })
  const { isLoading: isAddingBatch, isSuccess: isBatchSuccess } = useWaitForTransactionReceipt({ hash: batchHash })
  const { isLoading: isRemoving, isSuccess: isRemoveSuccess } = useWaitForTransactionReceipt({ hash: removeHash })

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Handle transaction success
  useEffect(() => {
    if (isAddSuccess || isBatchSuccess || isRemoveSuccess) {
      refetchDomains()
      setSuccess('Transaction completed successfully!')
      setDomainInput('')
      setBatchInput('')
    }
  }, [isAddSuccess, isBatchSuccess, isRemoveSuccess, refetchDomains])

  // Search effect
  useEffect(() => {
    if (searchQuery) {
      refetchSearch()
    }
  }, [searchQuery, refetchSearch])

  const handleAddDomain = useCallback(() => {
    setError('')
    setSuccess('')
    
    const validation = validateDomainName(domainInput)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid domain name')
      return
    }

    try {
      addDomain({
        address: CONTRACT_ADDRESS,
        abi: NNS_ABI,
        functionName: 'addAuctionableDomain',
        args: [domainInput],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to add domain')
    }
  }, [domainInput, addDomain])

  const handleAddBatch = useCallback(() => {
    setError('')
    setSuccess('')
    
    const domains = batchInput
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0)

    if (domains.length === 0) {
      setError('Please enter at least one domain')
      return
    }

    // Validate all domains
    for (const domain of domains) {
      const validation = validateDomainName(domain)
      if (!validation.isValid) {
        setError(`Invalid domain: ${domain} - ${validation.error}`)
        return
      }
    }

    try {
      addBatch({
        address: CONTRACT_ADDRESS,
        abi: NNS_ABI,
        functionName: 'addAuctionableDomainsBatch',
        args: [domains],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to add domains')
    }
  }, [batchInput, addBatch])

  const handleRemoveDomain = useCallback((domain: string) => {
    setError('')
    setSuccess('')
    
    try {
      removeDomain({
        address: CONTRACT_ADDRESS,
        abi: NNS_ABI,
        functionName: 'removeAuctionableDomain',
        args: [domain],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to remove domain')
    }
  }, [removeDomain])

  // Access control
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl border border-zinc-200 bg-white shadow-xl"
        >
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Wallet Not Connected</h2>
          <p className="text-zinc-600">Please connect your wallet to access the owner panel.</p>
        </motion.div>
      </div>
    )
  }

  if (isCheckingOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl border border-red-200 bg-white shadow-xl"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Access Denied</h2>
          <p className="text-zinc-600">You are not the contract owner.</p>
        </motion.div>
      </div>
    )
  }

  const displayDomains = searchQuery && searchResults ? searchResults : auctionableDomains

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900">Owner Panel</h1>
              <p className="text-sm text-zinc-600">Manage auctionable domains</p>
            </div>
          </div>
        </motion.div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Single Domain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-zinc-900">Add Single Domain</h2>
            </div>
            <p className="text-sm text-zinc-600 mb-4">Add one domain to the auctionable list</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Domain Name
                </label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="example.ntu"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              
              <button
                onClick={handleAddDomain}
                disabled={isAddingDomain || !domainInput}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingDomain ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Domain
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Add Batch Domains */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-zinc-900">Add Batch Domains</h2>
            </div>
            <p className="text-sm text-zinc-600 mb-4">Add multiple domains (one per line)</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Domain Names
                </label>
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="example1.ntu&#10;example2.ntu&#10;example3.ntu"
                  rows={5}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm"
                />
              </div>
              
              <button
                onClick={handleAddBatch}
                disabled={isAddingBatch || !batchInput}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingBatch ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding Batch...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Add Batch
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Search and List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-zinc-900">Auctionable Domains</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains (fuzzy search)..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {searchQuery && (
              <p className="mt-2 text-sm text-zinc-600">
                Found {searchResults?.length || 0} matching domain(s)
              </p>
            )}
          </div>

          {/* Domain List */}
          <div className="space-y-2">
            {isLoadingDomains ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : displayDomains && displayDomains.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto space-y-2">
                {(displayDomains as readonly string[]).map((domain) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 hover:border-purple-300 transition-colors"
                  >
                    <span className="font-medium text-zinc-900">{domain}</span>
                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      disabled={isRemoving}
                      className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500">
                  {searchQuery ? 'No domains found matching your search' : 'No auctionable domains yet. Add some above!'}
                </p>
              </div>
            )}
          </div>

          {!searchQuery && displayDomains && displayDomains.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <p className="text-sm text-zinc-600 text-center">
                Total: <span className="font-semibold text-zinc-900">{displayDomains.length}</span> auctionable domain(s)
              </p>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Only domains in the auctionable list can be started for auction. 
            Users will need to search for these domains and initiate auctions through the search page.
            The fuzzy search feature allows partial matches (e.g., searching "tech" will find "biotech.ntu").
          </p>
        </motion.div>
      </div>
    </div>
  )
}

