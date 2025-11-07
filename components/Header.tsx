'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Loader2, Crown, Send } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useIsOwner } from '@/lib/useIsOwner'

export const Header = memo(function Header() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { isOwner } = useIsOwner()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  const handleConnect = useCallback(() => {
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }, [connectors, connect])

  const formattedAddress = useMemo(() => 
    address ? formatAddress(address) : '', 
    [address, formatAddress]
  )

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-950/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <Image 
                src="/logo.svg" 
                alt="NNS Logo" 
                width={40} 
                height={40}
                className="drop-shadow-md"
                priority
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NNS
              </span>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Search
              </motion.span>
            </Link>
            <Link href="/my-domains">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                My Domains
              </motion.span>
            </Link>
            <Link href="/auctions">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                Auctions
              </motion.span>
            </Link>
            <Link href="/send-tokens">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send
              </motion.span>
            </Link>
            {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? (
              <Link href="/debug">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  Debug
                </motion.span>
              </Link>
            ) : null}
            {mounted && isOwner ? (
              <Link href="/owner">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  Owner
                </motion.span>
              </Link>
            ) : null}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {mounted && isConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formattedAddress}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </motion.button>
              </motion.div>
            ) : mounted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnect}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span>Connect Wallet</span>
              </motion.button>
            ) : (
              <div className="w-[140px] h-[40px]" />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
})

