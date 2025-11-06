'use client'

import { motion } from 'framer-motion'
import { Send, Loader2, AlertCircle, CheckCircle, Wallet, User, Globe } from 'lucide-react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ALP_CONTRACT_ADDRESS, ALP_ABI } from '@/lib/alpContract'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { formatUnits, parseUnits } from 'viem'

type RecipientType = 'unknown' | 'domain' | 'address'

export default function SendTokensPage() {
  const { address: userAddress, isConnected } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Detect recipient type
  const recipientType: RecipientType = useMemo(() => {
    if (!recipient) return 'unknown'
    
    const trimmed = recipient.trim()
    
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
  }, [recipient])

  // Read user's balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: ALP_CONTRACT_ADDRESS,
    abi: ALP_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
  })

  // Read token info
  const { data: tokenName } = useReadContract({
    address: ALP_CONTRACT_ADDRESS,
    abi: ALP_ABI,
    functionName: 'name',
  })

  const { data: tokenSymbol } = useReadContract({
    address: ALP_CONTRACT_ADDRESS,
    abi: ALP_ABI,
    functionName: 'symbol',
  })

  const { data: decimals } = useReadContract({
    address: ALP_CONTRACT_ADDRESS,
    abi: ALP_ABI,
    functionName: 'decimals',
  })

  // Write contract
  const { writeContract: sendTokens, data: txHash } = useWriteContract()

  // Wait for transaction
  const { isLoading: isSending, isSuccess: isSendSuccess } = useWaitForTransactionReceipt({ 
    hash: txHash 
  })

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
    if (isSendSuccess) {
      refetchBalance()
      setSuccess('Tokens sent successfully!')
      setRecipient('')
      setAmount('')
    }
  }, [isSendSuccess, refetchBalance])

  const handleSend = useCallback(() => {
    setError('')
    setSuccess('')
    
    // Validation
    if (!recipient.trim()) {
      setError('Please enter a recipient')
      return
    }

    if (recipientType === 'unknown') {
      setError('Invalid recipient. Must be a .ntu domain or Ethereum address')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!decimals) {
      setError('Unable to read token decimals')
      return
    }

    try {
      const parsedAmount = parseUnits(amount, decimals)
      
      // Check if user has enough balance
      if (balance && parsedAmount > balance) {
        setError('Insufficient balance')
        return
      }

      // Prepare recipient string (add 0x prefix if address without it)
      let recipientStr = recipient.trim()
      if (recipientType === 'address' && !recipientStr.startsWith('0x')) {
        recipientStr = '0x' + recipientStr
      }

      sendTokens({
        address: ALP_CONTRACT_ADDRESS,
        abi: ALP_ABI,
        functionName: 'sendTo',
        args: [recipientStr, parsedAmount],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to send tokens')
    }
  }, [recipient, recipientType, amount, decimals, balance, sendTokens])

  const formattedBalance = useMemo(() => {
    if (!balance || !decimals) return '0'
    return formatUnits(balance, decimals)
  }, [balance, decimals])

  const handleMaxClick = useCallback(() => {
    if (balance && decimals) {
      setAmount(formatUnits(balance, decimals))
    }
  }, [balance, decimals])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl border border-zinc-200 bg-white shadow-xl"
        >
          <Wallet className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Wallet Not Connected</h2>
          <p className="text-zinc-600">Please connect your wallet to send tokens.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900">Send Tokens</h1>
              <p className="text-sm text-zinc-600">Transfer to domains or addresses</p>
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg"
        >
          <div className="text-center">
            <p className="text-sm text-zinc-600 mb-1">Your Balance</p>
            <p className="text-3xl font-bold text-zinc-900">
              {formattedBalance} <span className="text-xl text-zinc-600">{tokenSymbol || 'ALP'}</span>
            </p>
          </div>
        </motion.div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Send Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg"
        >
          <div className="space-y-6">
            {/* Recipient Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Recipient
                </label>
                {recipientType !== 'unknown' && recipient && (
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {recipientType === 'domain' ? (
                      <>
                        <Globe className="h-3.5 w-3.5 text-purple-600" />
                        <span className="text-purple-600">Domain Name</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-blue-600">Address</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="alice.ntu or 0x1234..."
                className={`w-full rounded-lg border ${
                  recipient && recipientType === 'unknown'
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : recipientType === 'domain'
                    ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500/20'
                    : recipientType === 'address'
                    ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500/20'
                } bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 font-mono text-sm`}
              />
              <p className="mt-2 text-xs text-zinc-500">
                Enter a .ntu domain name or Ethereum address
              </p>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Amount
                </label>
                <button
                  onClick={handleMaxClick}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000001"
                  min="0"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-16 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-600">
                  {tokenSymbol || 'ALP'}
                </div>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Available: {formattedBalance} {tokenSymbol || 'ALP'}
              </p>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || !recipient || !amount || recipientType === 'unknown'}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-base font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Tokens
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>Smart Detection:</strong> The system automatically detects whether you're sending to a domain name (.ntu) or an Ethereum address (0x...).
            Domain names will be resolved to their owner's address automatically.
          </p>
        </motion.div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-xl border border-zinc-200 bg-white p-6"
        >
          <h3 className="text-sm font-semibold text-zinc-900 mb-3">Examples:</h3>
          <div className="space-y-2 text-sm text-zinc-600">
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-purple-600">Domain:</strong> alice.ntu, bob.ntu, computer.ntu
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-blue-600">Address:</strong> 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

