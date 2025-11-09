'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, LogOut, Loader2, Crown, Send, Menu, X, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useIsOwner } from '@/lib/useIsOwner'

export const Header = memo(function Header() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { isOwner } = useIsOwner()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

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
    <>
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
            <Link href="/commitments">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Commitments
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

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center gap-4">
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

    {/* Mobile Menu - Outside header for full height */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden"
          />
            
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] h-screen w-[85vw] max-w-[320px] bg-white dark:bg-zinc-900 shadow-2xl md:hidden overflow-y-auto flex flex-col"
          >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="flex items-center gap-2">
                  <Image 
                    src="/logo.svg" 
                    alt="NNS Logo" 
                    width={32} 
                    height={32}
                    className="drop-shadow-md"
                  />
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NNS Menu
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-white/50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 flex flex-col p-4 gap-1 overflow-y-auto">
                <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-zinc-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50 group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors">
                      <svg className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">Search</span>
                  </motion.div>
                </Link>
                
                <Link href="/my-domains" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-zinc-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/50 group-hover:bg-purple-500 dark:group-hover:bg-purple-600 transition-colors">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">My Domains</span>
                  </motion.div>
                </Link>
                
                <Link href="/auctions" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-zinc-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50 group-hover:bg-orange-500 dark:group-hover:bg-orange-600 transition-colors">
                      <svg className="h-4 w-4 text-orange-600 dark:text-orange-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <span className="text-base font-medium">Auctions</span>
                  </motion.div>
                </Link>
                
                <Link href="/commitments" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-zinc-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/50 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-600 transition-colors">
                      <Lock className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-medium">Commitments</span>
                  </motion.div>
                </Link>
                
                <Link href="/send-tokens" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-zinc-300 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/50 group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-colors">
                      <Send className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-medium">Send</span>
                  </motion.div>
                </Link>
                
                {process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && (
                  <Link href="/debug" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800 transition-all"
                    >
                      <span className="text-base font-medium">Debug</span>
                    </motion.div>
                  </Link>
                )}
                
                {mounted && isOwner && (
                  <Link href="/owner" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-amber-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:text-amber-400 dark:hover:from-amber-950/30 dark:hover:to-orange-950/30 transition-all group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/50 group-hover:bg-amber-500 dark:group-hover:bg-amber-600 transition-colors">
                        <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-base font-medium">Owner</span>
                    </motion.div>
                  </Link>
                )}
              </nav>

              {/* Mobile Wallet Section */}
              <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                {mounted && isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-4 py-3 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-0.5">Connected</p>
                        <span className="text-sm font-mono font-semibold text-green-900 dark:text-green-300 truncate block">
                          {formattedAddress}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        disconnect()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </motion.button>
                  </div>
                ) : mounted ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleConnect()
                      setMobileMenuOpen(false)
                    }}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wallet className="h-5 w-5" />
                    )}
                    <span>Connect Wallet</span>
                  </motion.button>
                ) : null}
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  )
})

