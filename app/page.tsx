'use client'

import { motion } from 'framer-motion'
import { SearchBar } from '@/components/SearchBar'
import { Sparkles, Shield, Zap, Globe, BookOpen, Code, Users, Lock, Clock, RefreshCw, Send, Eye, EyeOff, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Shield,
    title: 'Secure Blind Auction',
    description: 'Commit-reveal mechanism ensures fair bidding without revealing your bid amount upfront'
  },
  {
    icon: Zap,
    title: 'Instant Resolution',
    description: 'Resolve .ntu domains to Ethereum addresses instantly on-chain'
  },
  {
    icon: Globe,
    title: 'Full Ownership',
    description: 'You own your domain completely with transfer and renewal capabilities'
  },
  {
    icon: Sparkles,
    title: 'Modern Platform',
    description: 'Beautiful, fast, and intuitive interface built with the latest web technologies'
  }
]

export default function Home() {
  const [showUIGuide, setShowUIGuide] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)
  const [showTechnical, setShowTechnical] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        {/* Static background elements - removed animations for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-purple-400/20 to-blue-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>NTU Name Service - Web3 Domains Made Simple</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl"
            >
              Your Identity on
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Blockchain
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl"
            >
              Register your unique .ntu domain through our secure blind auction system.
              Own your digital identity forever.
            </motion.p>

            {/* Search Bar */}
            <div className="flex justify-center">
              <SearchBar />
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                { label: 'Auction Duration', value: 'Configurable' },
                { label: 'Renewal Period', value: '90 Days Grace' },
                { label: 'Domain Ownership', value: '1 Year + Renewable' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Why Choose NNS?
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Built on Ethereum with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go Deeper Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-4xl mb-4">
              Go Deeper
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Understand how NNS works under the hood
            </p>
          </motion.div>

          {/* UI Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <button
              onClick={() => setShowUIGuide(!showUIGuide)}
              className="flex items-center justify-between w-full gap-3 mb-8 p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    How to Use NNS
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Step-by-step guide for users
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                {showUIGuide ? (
                  <ChevronUp className="h-6 w-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                ) : (
                  <ChevronDown className="h-6 w-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: showUIGuide ? 'auto' : 0,
                opacity: showUIGuide ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
              {/* Step 1: Search */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Search for a Domain
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Use the search bar to find your desired .ntu domain name. The system will check if it's available or show you auction details if one is active.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Search is instant and free</span>
                </div>
              </div>

              {/* Step 2: Commit */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    Commit Your Bid <EyeOff className="h-4 w-4" />
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  During the commit phase, submit a hidden commitment with your bid amount. Your actual bid stays secret thanks to cryptographic hashing.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Your bid amount remains private</span>
                </div>
              </div>

              {/* Step 3: Reveal */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    Reveal Your Bid <Eye className="h-4 w-4" />
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  After commit phase ends, reveal your actual bid amount. The smart contract verifies it matches your commitment and determines the highest bidder.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Must reveal before reveal phase ends</span>
                </div>
              </div>

              {/* Step 4: Finalize */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold">
                    4
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Finalize & Win
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Anyone can finalize the auction after reveal phase. The winner gets the domain, and losing bidders can withdraw their full deposits.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Winner pays only their bid amount</span>
                </div>
              </div>

              {/* Step 5: Manage */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-bold">
                    5
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    Manage Your Domain <RefreshCw className="h-4 w-4" />
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Transfer your domain to others or renew it before expiry. You have a 90-day grace period after expiration to renew at the same price.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Full control over your domain</span>
                </div>
              </div>

              {/* Step 6: Send Tokens */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold">
                    6
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    Send to Domains <Send className="h-4 w-4" />
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Send ETH directly to domain names instead of long addresses. The smart contract resolves the domain and forwards your payment instantly.
                </p>
                <div className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                  <Zap className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Simple, human-readable transactions</span>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Let's Understand the Architecture - NEW SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-16"
          >
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center justify-between w-full gap-3 mb-8 p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Let's Understand the Architecture
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Visual system specification: commit-reveal mechanism & cryptographic privacy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                {showArchitecture ? (
                  <ChevronUp className="h-6 w-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                ) : (
                  <ChevronDown className="h-6 w-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: showArchitecture ? 'auto' : 0,
                opacity: showArchitecture ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-8 pb-4">
                
                {/* System Layers Architecture */}
                <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-8">
                  <h4 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></div>
                    System Architecture Layers
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Layer 4 - Top */}
                    <div className="relative">
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Layer 4: User Interface</span>
                          <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded text-center font-mono">Search</div>
                          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded text-center font-mono">Auctions</div>
                          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded text-center font-mono">My Domains</div>
                          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded text-center font-mono">Owner Panel</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-300 to-blue-300 dark:from-emerald-700 dark:to-blue-700"></div>
                      </div>
                    </div>

                    {/* Layer 3 */}
                    <div className="relative">
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-blue-300 dark:border-blue-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Layer 3: Query & View Functions</span>
                          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-center font-mono">getAuctionInfo()</div>
                          <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-center font-mono">resolve()</div>
                          <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-center font-mono">searchAuctions()</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700"></div>
                      </div>
                    </div>

                    {/* Layer 2 */}
                    <div className="relative">
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-purple-300 dark:border-purple-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Layer 2: Auction Logic & State Management</span>
                          <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded text-center">
                              <div className="text-xs font-bold text-purple-900 dark:text-purple-100">Auction State Machine</div>
                              <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-1">Commit → Reveal → Finalize</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded text-center">
                              <div className="text-xs font-bold text-purple-900 dark:text-purple-100">Domain Registry</div>
                              <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-1">Ownership & Metadata</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-purple-300 to-orange-300 dark:from-purple-700 dark:to-orange-700"></div>
                      </div>
                    </div>

                    {/* Layer 1 */}
                    <div className="relative">
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-orange-300 dark:border-orange-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Layer 1: Cryptographic Security</span>
                          <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded text-center font-mono">keccak256</div>
                          <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded text-center font-mono">Commitment Store</div>
                          <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded text-center font-mono">Hash Validation</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-orange-300 to-red-300 dark:from-orange-700 dark:to-red-700"></div>
                      </div>
                    </div>

                    {/* Layer 0 - Bottom */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-xl border-2 border-red-300 dark:border-red-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Layer 0: Ethereum Blockchain</span>
                          <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-center text-xs text-red-700 dark:text-red-300 font-mono">
                          Immutable Storage • EVM Execution • Consensus Security
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commitment Hash Calculation Flow */}
                <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 p-8">
                  <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                    Commitment Hash Calculation (keccak256)
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Input Parameters */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                      <div className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-4 uppercase tracking-wide">Input Parameters</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mb-1">string name</div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">"alice.ntu"</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Target domain</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mb-1">uint256 bidAmount</div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">1.5 ETH</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Your bid</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mb-1">bytes32 secret</div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">0x4f3a8b...</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Random value (KEEP SECRET!)</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mb-1">address bidder</div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">0x742d...</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Your wallet address</div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl text-blue-500 dark:text-blue-400">↓</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">abi.encode()</div>
                      </div>
                    </div>

                    {/* Encoding Step */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                      <div className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3 uppercase tracking-wide">ABI Encoding</div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700 font-mono text-xs overflow-x-auto">
                        <div className="text-purple-600 dark:text-purple-400">// All parameters concatenated into bytes</div>
                        <div className="text-zinc-700 dark:text-zinc-300 mt-1">
                          616c6963652e6e7475000000000000000000000000000000000000000000000000
                          <br />
                          00000000000000000000000000000000000000000000000014d1120d7b160000
                          <br />
                          4f3a8b7c2d1e9f0a5b6c3d8e1f2a0b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a
                          <br />
                          000000000000000000000000742d35cc6634c0532925a3b844bc9e7ddf3479f8
                        </div>
                      </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl text-purple-500 dark:text-purple-400">↓</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">keccak256()</div>
                      </div>
                    </div>

                    {/* Hash Output */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
                      <div className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Commitment Hash (bytes32)
                      </div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <div className="font-mono text-sm text-orange-600 dark:text-orange-400 break-all">
                          0x8f7e6d5c4b3a2910fedcba9876543210abcdef0123456789deadbeef87654321
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          This is what gets submitted to the blockchain during commit phase
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why This Matters Box */}
                  <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-xl p-6 border-2 border-yellow-300 dark:border-yellow-700">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">🔐 Why One-Way Hashing is Critical</h5>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                          <li>• <strong>Irreversible</strong>: Cannot derive inputs from hash (computationally infeasible)</li>
                          <li>• <strong>Deterministic</strong>: Same inputs always produce same hash</li>
                          <li>• <strong>Unique</strong>: Different inputs produce completely different hashes (avalanche effect)</li>
                          <li>• <strong>Fixed size</strong>: Always 32 bytes regardless of input size</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Privacy is Maintained - Timing Diagram */}
                <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 p-8">
                  <h4 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                    Why Your Bid Stays Private Until Reveal
                  </h4>

                  <div className="space-y-6">
                    {/* Timeline */}
                    <div className="relative">
                      {/* Horizontal timeline */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex-1 h-2 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 dark:from-blue-700 dark:via-purple-700 dark:to-green-700 rounded-full"></div>
                      </div>

                      {/* Phase 1: Commit */}
                      <div className="mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-xl p-6 border-2 border-blue-300 dark:border-blue-700">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                            <div>
                              <h5 className="font-bold text-blue-900 dark:text-blue-100">COMMIT PHASE</h5>
                              <p className="text-xs text-blue-700 dark:text-blue-300">Duration: commitPhaseDuration</p>
                            </div>
                            <EyeOff className="h-6 w-6 text-blue-500 ml-auto" />
                          </div>

                          <div className="space-y-3">
                            <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">What Blockchain Sees:</div>
                              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                                <div>• Commitment: <span className="text-blue-600 dark:text-blue-400">0x8f7e6d5c...</span></div>
                                <div>• Locked ETH: <span className="text-blue-600 dark:text-blue-400">2.0 ETH</span></div>
                                <div>• Bidder: <span className="text-blue-600 dark:text-blue-400">0x742d35...</span></div>
                                <div>• Timestamp: <span className="text-blue-600 dark:text-blue-400">1699564800</span></div>
                              </div>
                            </div>

                            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
                              <div className="text-sm font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                                <EyeOff className="h-4 w-4" />
                                What Blockchain CANNOT See:
                              </div>
                              <div className="font-mono text-xs text-red-700 dark:text-red-300 space-y-1">
                                <div>✗ Domain name: <span className="blur-sm select-none">"alice.ntu"</span></div>
                                <div>✗ Actual bid: <span className="blur-sm select-none">1.5 ETH</span></div>
                                <div>✗ Secret: <span className="blur-sm select-none">0x4f3a8b...</span></div>
                              </div>
                              <div className="text-xs text-red-600 dark:text-red-400 mt-2 font-semibold">
                                ⚠️ Impossible to reverse-engineer from hash alone!
                              </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                              <div className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span><strong>Privacy Protection:</strong> Even if someone tries all possible bids (brute force), the secret value (32 bytes = 2<sup>256</sup> possibilities) makes it computationally impossible to guess.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phase 2: Reveal */}
                      <div className="mb-8">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-xl p-6 border-2 border-purple-300 dark:border-purple-700">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                            <div>
                              <h5 className="font-bold text-purple-900 dark:text-purple-100">REVEAL PHASE</h5>
                              <p className="text-xs text-purple-700 dark:text-purple-300">Duration: revealPhaseDuration</p>
                            </div>
                            <Eye className="h-6 w-6 text-purple-500 ml-auto" />
                          </div>

                          <div className="space-y-3">
                            <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Bidder Reveals:</div>
                              <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                                <div>• name: <span className="text-purple-600 dark:text-purple-400">"alice.ntu"</span></div>
                                <div>• bidAmount: <span className="text-purple-600 dark:text-purple-400">1.5 ETH</span></div>
                                <div>• secret: <span className="text-purple-600 dark:text-purple-400">0x4f3a8b...</span></div>
                              </div>
                            </div>

                            <div className="flex justify-center my-2">
                              <div className="text-xl text-purple-500">↓</div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                              <div className="text-sm font-bold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Smart Contract Verification:
                              </div>
                              <div className="font-mono text-xs text-green-700 dark:text-green-300 space-y-2">
                                <div className="bg-white dark:bg-zinc-900 rounded p-2">
                                  expected = keccak256("alice.ntu", 1.5 ETH, 0x4f3a8b..., 0x742d35...)
                                  <br />
                                  = <span className="text-green-600 dark:text-green-400">0x8f7e6d5c...</span>
                                </div>
                                <div className="bg-white dark:bg-zinc-900 rounded p-2">
                                  stored = _bidderCommitment[0x742d35...]
                                  <br />
                                  = <span className="text-green-600 dark:text-green-400">0x8f7e6d5c...</span>
                                </div>
                                <div className="font-bold text-green-600 dark:text-green-400 text-center py-2">
                                  ✓ MATCH! Bid is valid.
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                              <div className="text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span><strong>Timing Validation:</strong> Contract checks that commitment timestamp &lt; commitEnd. This prevents creating commitments after seeing other bids (post-auction manipulation).</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phase 3: Finalize */}
                      <div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/40 rounded-xl p-6 border-2 border-green-300 dark:border-green-700">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                            <div>
                              <h5 className="font-bold text-green-900 dark:text-green-100">FINALIZE</h5>
                              <p className="text-xs text-green-700 dark:text-green-300">After revealEnd timestamp</p>
                            </div>
                            <Sparkles className="h-6 w-6 text-green-500 ml-auto" />
                          </div>

                          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
                            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">Auction Results:</div>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded">
                                <span className="font-mono text-green-700 dark:text-green-300">Winner:</span>
                                <span className="font-bold text-green-900 dark:text-green-100">0x742d35... (1.5 ETH)</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                                <span className="font-mono text-zinc-600 dark:text-zinc-400">Other bidders:</span>
                                <span className="text-zinc-700 dark:text-zinc-300">Full refund available</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attack Prevention Diagram */}
                <div className="rounded-2xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-8">
                  <h4 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-6 flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Attack Prevention Architecture
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Attack 1 */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border-2 border-red-300 dark:border-red-700">
                      <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Attack: Bid Sniping
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                        Attacker sees your bid of 1.5 ETH and submits 1.51 ETH to win by minimal margin.
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-300 dark:border-green-700">
                        <div className="text-xs font-bold text-green-800 dark:text-green-200 mb-1">✓ Prevention:</div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          During commit phase, your bid amount is hidden in the hash. Attacker only sees hash, not the 1.5 ETH value.
                        </div>
                      </div>
                    </div>

                    {/* Attack 2 */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border-2 border-red-300 dark:border-red-700">
                      <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Attack: Front-Running
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                        MEV bot detects your commit transaction in mempool and submits same commitment with higher gas to get mined first.
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-300 dark:border-green-700">
                        <div className="text-xs font-bold text-green-800 dark:text-green-200 mb-1">✓ Prevention:</div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Commitment includes your address. Bot can't copy your hash because it would need your exact secret (unknown to them).
                        </div>
                      </div>
                    </div>

                    {/* Attack 3 */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border-2 border-red-300 dark:border-red-700">
                      <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Attack: Post-Commit Manipulation
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                        Attacker waits until reveal phase, sees highest bid is 2 ETH, then tries to create commitment for 2.1 ETH.
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-300 dark:border-green-700">
                        <div className="text-xs font-bold text-green-800 dark:text-green-200 mb-1">✓ Prevention:</div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Contract checks: commitTimestamp &lt; commitEnd. Late commitments are rejected during reveal validation.
                        </div>
                      </div>
                    </div>

                    {/* Attack 4 */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border-2 border-red-300 dark:border-red-700">
                      <div className="text-sm font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Attack: Commitment Spam
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                        Attacker commits hundreds of hashes with no intention to reveal, blocking legitimate bidders.
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-300 dark:border-green-700">
                        <div className="text-xs font-bold text-green-800 dark:text-green-200 mb-1">✓ Prevention:</div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Non-revealers forfeit their locked ETH. Economic penalty makes spam costly. Plus commitBid() requires ETH &gt; 0.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Flow Diagram */}
                <div className="rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 bg-white dark:bg-zinc-900 p-8">
                  <h4 className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-600 animate-pulse"></div>
                    Complete Data Flow: Bidder → Contract → Storage
                  </h4>

                  <div className="space-y-4">
                    {/* User to Frontend */}
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg p-4 flex-1 border border-blue-300 dark:border-blue-700">
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-1">USER INPUT</div>
                        <div className="font-mono text-xs text-blue-700 dark:text-blue-300">name, bid, secret</div>
                      </div>
                      <div className="text-2xl text-cyan-500">→</div>
                      <div className="bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40 rounded-lg p-4 flex-1 border border-cyan-300 dark:border-cyan-700">
                        <div className="text-xs font-bold text-cyan-900 dark:text-cyan-100 mb-1">FRONTEND (JavaScript)</div>
                        <div className="font-mono text-xs text-cyan-700 dark:text-cyan-300">makeCommitment()</div>
                      </div>
                    </div>

                    {/* Frontend to Contract */}
                    <div className="flex justify-center">
                      <div className="text-2xl text-cyan-500">↓</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-lg p-4 flex-1 border border-purple-300 dark:border-purple-700">
                        <div className="text-xs font-bold text-purple-900 dark:text-purple-100 mb-1">TRANSACTION</div>
                        <div className="font-mono text-xs text-purple-700 dark:text-purple-300">commitBid(hash) + ETH</div>
                      </div>
                      <div className="text-2xl text-cyan-500">→</div>
                      <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-lg p-4 flex-1 border border-orange-300 dark:border-orange-700">
                        <div className="text-xs font-bold text-orange-900 dark:text-orange-100 mb-1">SMART CONTRACT</div>
                        <div className="font-mono text-xs text-orange-700 dark:text-orange-300">commitBid() function</div>
                      </div>
                    </div>

                    {/* Contract to Storage */}
                    <div className="flex justify-center">
                      <div className="text-2xl text-cyan-500">↓</div>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-6 border-2 border-zinc-300 dark:border-zinc-700">
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase">Blockchain Storage (State Variables)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="bg-white dark:bg-zinc-950 rounded p-3 border border-zinc-300 dark:border-zinc-700">
                          <div className="text-cyan-600 dark:text-cyan-400 mb-1">_commitmentValues</div>
                          <div className="text-zinc-600 dark:text-zinc-400">[hash] → ETH amount</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 rounded p-3 border border-zinc-300 dark:border-zinc-700">
                          <div className="text-cyan-600 dark:text-cyan-400 mb-1">_bidderCommitment</div>
                          <div className="text-zinc-600 dark:text-zinc-400">[address] → hash</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-950 rounded p-3 border border-zinc-300 dark:border-zinc-700">
                          <div className="text-cyan-600 dark:text-cyan-400 mb-1">_bidderCommitTime</div>
                          <div className="text-zinc-600 dark:text-zinc-400">[address] → timestamp</div>
                        </div>
                      </div>
                    </div>

                    {/* During Reveal */}
                    <div className="flex justify-center my-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                        REVEAL PHASE BEGINS
                      </div>
                    </div>

                    {/* Reveal Flow */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border-2 border-green-300 dark:border-green-700">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 flex-1 border border-green-300 dark:border-green-700">
                          <div className="text-xs font-bold text-green-900 dark:text-green-100 mb-1">USER REVEALS</div>
                          <div className="font-mono text-xs text-green-700 dark:text-green-300">revealBid(name, bid, secret)</div>
                        </div>
                        <div className="text-2xl text-green-500">→</div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 flex-1 border border-green-300 dark:border-green-700">
                          <div className="text-xs font-bold text-green-900 dark:text-green-100 mb-1">CONTRACT VERIFIES</div>
                          <div className="font-mono text-xs text-green-700 dark:text-green-300">hash(inputs) == stored</div>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-green-300 dark:border-green-700 text-center">
                        <div className="text-xs text-green-600 dark:text-green-400 font-bold">✓ If match: Update highestBid/highestBidder</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Takeaways */}
                <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-8">
                  <h4 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Key Architectural Principles
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 border border-emerald-300 dark:border-emerald-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">Cryptographic Commitment</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            One-way hash functions (keccak256) ensure bids cannot be reverse-engineered from commitment hashes.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 border border-emerald-300 dark:border-emerald-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">Secret Value Protection</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            32-byte secret (2<sup>256</sup> possibilities) makes brute-force attacks computationally impossible even with known bid amounts.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 border border-emerald-300 dark:border-emerald-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">Temporal Validation</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            Timestamp checks prevent post-commit manipulation. Commitments must be created before reveal phase starts.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 border border-emerald-300 dark:border-emerald-700">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">Economic Incentives</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            Non-revealers forfeit deposits, ensuring honest participation and preventing commitment spam attacks.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>

          {/* Technical Deep Dive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex items-center justify-between w-full gap-3 mb-8 p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <Code className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Technical Architecture & Smart Contract Deep Dive
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Detailed explanation of the NTUDomainName.sol contract
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                {showTechnical ? (
                  <ChevronUp className="h-6 w-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                ) : (
                  <ChevronDown className="h-6 w-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: showTechnical ? 'auto' : 0,
                opacity: showTechnical ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pb-4">
              {/* Overview */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                      System Overview
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      The NTU Domain Name Service (NNS) is a decentralized domain name registrar built on Ethereum using Solidity ^0.8.20. 
                      It implements a <strong>commit-reveal blind auction mechanism</strong> to ensure fair and private bidding for .ntu domain names. 
                      The contract inherits from OpenZeppelin's <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">Ownable</code> for access control and implements a custom reentrancy guard for secure fund transfers.
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Key features include: blind auction system, domain renewal with grace period, domain transfer capabilities, human-readable ETH transfers to domains, 
                      and comprehensive auction management with timing controls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Data Structures */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Core Data Structures
                </h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      struct DomainMeta
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Stores essential metadata for each registered domain:
                    </p>
                    <ul className="text-xs text-zinc-500 dark:text-zinc-500 space-y-1 ml-4">
                      <li>• <code>registrationDate</code>: Timestamp when domain was first registered (uint64)</li>
                      <li>• <code>expiryDate</code>: When domain expires (uint64, initially 365 days from registration)</li>
                      <li>• <code>registrant</code>: Current owner's address</li>
                      <li>• <code>lastBidAmount</code>: Amount paid in auction (used for renewal pricing)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      struct Auction
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Tracks auction state and participants:
                    </p>
                    <ul className="text-xs text-zinc-500 dark:text-zinc-500 space-y-1 ml-4">
                      <li>• <code>commitEnd</code>: Unix timestamp when commit phase ends</li>
                      <li>• <code>revealEnd</code>: Unix timestamp when reveal phase ends</li>
                      <li>• <code>exists</code> & <code>finalized</code>: State flags</li>
                      <li>• <code>highestBidder</code> & <code>highestBid</code>: Current winning bid</li>
                      <li>• <code>{'mapping(address => uint256) refundable'}</code>: Tracks refunds per bidder</li>
                      <li>• <code>{'mapping(address => bool) revealed'}</code>: Prevents double-revealing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Function 1: makeCommitment */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function makeCommitment(string memory name, uint256 bidAmount, bytes32 secret, address bidder) 
                    public pure returns (bytes32)
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  This is a <strong>pure function</strong> (no state access) that generates a cryptographic commitment hash using keccak256. 
                  It combines the domain name, bid amount, a random secret, and the bidder's address into a single hash that conceals the bid details.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Why This Matters</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  By hashing these parameters together, bidders can prove their bid later without revealing it upfront. This prevents:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• <strong>Bid sniping</strong>: Others can't see your bid and outbid by small amounts</li>
                  <li>• <strong>Front-running</strong>: MEV bots can't extract value by placing bids right before yours</li>
                  <li>• <strong>Strategic manipulation</strong>: No information leakage during commit phase</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Called off-chain (e.g., in the frontend or Python utility) to generate the commitment before calling <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">commitBid()</code>. 
                  The bidder must store the secret and bid amount to reveal later.
                </p>
              </div>

              {/* Function 2: startAuction */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function startAuction(string calldata name) external
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Initializes a new auction for a domain that's either never been registered or has expired past its grace period. 
                  Sets <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">commitEnd</code> and <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">revealEnd</code> timestamps based on immutable durations set at deployment.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Security Checks</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Validates domain format (must end with .ntu, length 5-40 chars)</li>
                  <li>• Ensures domain is in the auctionable list (admin-controlled)</li>
                  <li>• Checks domain isn't active (not expired)</li>
                  <li>• Verifies renewal grace period (90 days) has passed</li>
                  <li>• Prevents starting if an auction is already running</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Optimizations</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Uses <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">uint64</code> for timestamps (sufficient until year 2262) to save storage costs. 
                  The <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">calldata</code> keyword for strings reduces gas by avoiding memory copying.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Called by any user to start bidding for available domains. The auction system is permissionless – anyone can trigger it, 
                  but only for admin-approved auctionable domains.
                </p>
              </div>

              {/* Function 3: commitBid */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function commitBid(bytes32 commitment) external payable
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Accepts a commitment hash and ETH payment during the commit phase. The commitment is stored <strong>globally</strong> (not tied to a specific auction), 
                  allowing bidders to hide which auction they're bidding on until the reveal phase.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Key Design Choice: Global Commitments</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Unlike typical auction systems, commitments aren't linked to specific auctions. This provides extra privacy – 
                  even the auction target is hidden until reveal. The contract tracks:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_commitmentValues[commitment]</code>: Total ETH locked for this hash</li>
                  <li>• <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_bidderCommitment[msg.sender]</code>: Bidder's latest commitment</li>
                  <li>• <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_bidderCommitTime[msg.sender]</code>: When commitment was made (for validation)</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Security Features</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Requires non-zero ETH to prevent spam</li>
                  <li>• Allows multiple commits to same hash (accumulates value)</li>
                  <li>• Timestamp recorded for commit-time validation during reveal</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bidders commit during the commit phase window. They must send ETH ≥ their intended bid amount. 
                  Excess ETH acts as a deposit that's refunded after finalization if they lose.
                </p>
              </div>

              {/* Function 4: revealBid */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function revealBid(string calldata name, uint256 bidAmount, bytes32 secret) external
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  During the reveal phase, bidders disclose their bid parameters (name, amount, secret). 
                  The contract reconstructs the commitment hash and verifies it matches what was submitted earlier.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Validation Steps (Critical!)</h5>
                <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 ml-6 mb-4 list-decimal">
                  <li><strong>Auction exists and is in reveal phase</strong> (between commitEnd and revealEnd)</li>
                  <li><strong>Bidder hasn't already revealed</strong> (prevents double-reveal attacks)</li>
                  <li><strong>Commitment was made before commit phase ended</strong> (prevents post-auction manipulation)</li>
                  <li><strong>Hash verification</strong>: <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">makeCommitment(name, bidAmount, secret, msg.sender)</code> must match stored commitment</li>
                  <li><strong>Sufficient locked funds</strong>: Committed ETH must be ≥ bid amount</li>
                </ol>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">State Updates</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  On successful reveal, the contract marks the bidder as revealed, records their refundable amount, 
                  and updates <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">highestBid</code> / <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">highestBidder</code> if this bid is higher than current highest.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  All bidders must reveal before reveal phase ends, or they forfeit their deposits. 
                  This incentivizes honest participation and prevents griefing (committing without intending to bid).
                </p>
              </div>

              {/* Function 5: finalize */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function finalize(string calldata name) external
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Closes the auction after reveal phase ends. Anyone can call this (permissionless finalization). 
                  The winner is registered as domain owner, and their winning bid is transferred to the beneficiary address.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Fund Distribution Logic</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 ml-6 mb-4">
                  <li>• <strong>Winner</strong>: Deducts winning bid from refundable balance, sends it to beneficiary, registers domain</li>
                  <li>• <strong>Losers</strong>: Full refundable amounts remain in contract for withdrawal</li>
                  <li>• <strong>Non-revealers</strong>: Deposits remain in contract but cannot withdraw (penalty for not revealing)</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Domain Registration</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Calls internal <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_register()</code> which:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Sets <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">domainNameOwner[name]</code> to winner's address</li>
                  <li>• Creates DomainMeta with registration date, expiry date (365 days), and lastBidAmount</li>
                  <li>• Adds to <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_ownerDomains</code> and <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_allDomains</code> arrays for reverse lookups</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Optimizations</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Uses low-level <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">.call{"{"}value: amount{"}"}("")</code> instead of <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">.transfer()</code> to avoid 2300 gas limit and handle contract recipients. 
                  Reverts with <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">PaymentFailed</code> error if transfer fails.
                </p>
              </div>

              {/* Function 6: withdraw */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function withdraw(string calldata name) external
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Allows bidders to reclaim their refundable ETH after auction is finalized. Uses checks-effects-interactions pattern for security.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Security Pattern (Critical!)</h5>
                <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 ml-6 mb-4 list-decimal">
                  <li><strong>Check</strong>: Verify auction exists and is finalized, ensure refundable amount &gt; 0</li>
                  <li><strong>Effect</strong>: Set <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">refundable[msg.sender] = 0</code> BEFORE transfer</li>
                  <li><strong>Interaction</strong>: Execute external call to send ETH</li>
                </ol>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  This prevents reentrancy attacks where a malicious contract could recursively call withdraw() before state updates.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Losing bidders call this after finalization to get full deposits back. Winners get back (deposit - winning bid).
                </p>
              </div>

              {/* Function 7: renewDomain */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function renewDomain(string calldata name) external payable
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Allows domain owners to extend their registration for another 365 days. Must pay the same amount as original bid (<code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">lastBidAmount</code>).
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Grace Period Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Owners have a 90-day window after expiry to renew. During this period:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Domain is considered unavailable (can't start new auction)</li>
                  <li>• Original owner retains exclusive renewal rights</li>
                  <li>• After 90 days, domain returns to auction pool</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Validation Checks</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Only registrant can renew (prevents hostile takeover during grace period)</li>
                  <li>• Domain must be expired (can't pre-renew to save on auction prices)</li>
                  <li>• Must be within 90-day grace window</li>
                  <li>• Payment must exactly match <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">lastBidAmount</code></li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Protects domain owners from accidentally losing valuable domains. More economical than re-bidding in auction.
                </p>
              </div>

              {/* Function 8: transferDomain */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function transferDomain(string calldata name, address to) external
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Transfers domain ownership to another address. Updates both ownership mapping and metadata registrant field.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Array Management Optimization</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Calls internal <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_moveDomain()</code> which efficiently removes domain from sender's array using swap-and-pop technique:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Finds domain in <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_ownerDomains[from]</code> array</li>
                  <li>• Swaps it with last element</li>
                  <li>• Pops last element (O(1) operation vs O(n) deletion)</li>
                  <li>• Adds to <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_ownerDomains[to]</code></li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Security Checks</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Only current owner can transfer</li>
                  <li>• Cannot transfer to zero address</li>
                  <li>• Domain must not be expired</li>
                </ul>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Enables domain trading, gifting, or organizational ownership changes. Expiry date transfers with domain.
                </p>
              </div>

              {/* Function 9: sendToDomain */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg block overflow-x-auto">
                    function sendToDomain(string calldata name) external payable nonReentrant
                  </code>
                </div>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Purpose & Mechanism</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Implements human-readable payment system. Resolves domain to owner address and forwards ETH instantly.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Reentrancy Protection</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Uses custom <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">nonReentrant</code> modifier (not OpenZeppelin's for gas savings):
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 ml-6 mb-4">
                  <li>• Sets <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_locked = 2</code> before function execution</li>
                  <li>• Reverts if already locked</li>
                  <li>• Resets to <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">_locked = 1</code> after completion</li>
                </ul>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  Critical because external call to domain owner could be a malicious contract attempting reentrancy.
                </p>
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Use Case</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Enables users to send ETH to "alice.ntu" instead of "0x742d35...". Frontend resolves domain and calls this function.
                </p>
              </div>

              {/* Admin Functions */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Admin & Auction Management Functions
                </h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      addAuctionableDomain(string calldata name) / addAuctionableDomainsBatch(string[] calldata names)
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <strong>Owner-only functions</strong> to curate which domains can be auctioned. Prevents spam/inappropriate domains. 
                      Batch function optimizes gas when adding multiple domains.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      removeAuctionableDomain(string calldata name)
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Removes domain from auctionable list. Uses swap-and-pop pattern for efficient array deletion. 
                      Important: doesn't affect already-running auctions or registered domains.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      getAuctionInfo(string calldata name) / searchAuctions(string calldata filterPhase)
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      View functions for querying auction state. <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">getAuctionInfo</code> returns complete auction details including current phase and time remaining. 
                      <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">searchAuctions</code> filters all auctions by phase (commit/reveal/pending/finalized).
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <code className="text-xs text-purple-600 dark:text-purple-400 font-mono mb-2 block">
                      resolve(string calldata name) / reverseResolve(address owner) / allDomains()
                    </code>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Domain lookup utilities. <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">resolve</code> maps name→address, <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">reverseResolve</code> maps address→domains[], 
                      <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">allDomains</code> returns complete registry.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gas Optimizations Summary */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20 p-8">
                <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Gas Optimizations Implemented
                </h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
                  <li>• <strong>uint64 for timestamps</strong>: Saves storage slots (256 bits → 64 bits)</li>
                  <li>• <strong>Calldata instead of memory</strong>: Avoids copying string data for read-only operations</li>
                  <li>• <strong>Custom reentrancy guard</strong>: Single storage slot vs OpenZeppelin's implementation</li>
                  <li>• <strong>Swap-and-pop array deletion</strong>: O(1) removal instead of O(n) shifting</li>
                  <li>• <strong>Immutable variables</strong>: Durations and beneficiary address stored in bytecode, not storage</li>
                  <li>• <strong>Custom errors</strong>: More gas-efficient than require strings (Solidity 0.8.4+)</li>
                  <li>• <strong>Unchecked arithmetic</strong>: Used in loops where overflow impossible (not shown but possible)</li>
                </ul>
              </div>

              {/* Security Features Summary */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 p-8">
                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Features & Attack Prevention
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>• <strong>Commit-reveal scheme</strong>: Prevents bid sniping and front-running attacks</li>
                  <li>• <strong>Timestamp validation</strong>: Ensures commits happened before reveal phase</li>
                  <li>• <strong>Reentrancy protection</strong>: Custom guard on sendToDomain, checks-effects-interactions pattern on withdraw</li>
                  <li>• <strong>Input validation</strong>: Domain format checking, zero-address prevention, auction state verification</li>
                  <li>• <strong>Access control</strong>: Ownable pattern for admin functions, registrant checks for transfers/renewals</li>
                  <li>• <strong>Grace period mechanism</strong>: Protects owners from accidental domain loss</li>
                  <li>• <strong>Reveal penalty</strong>: Non-revealers lose deposits, preventing commitment spam</li>
                  <li>• <strong>Low-level call safety</strong>: Checks return values, reverts on failure</li>
                </ul>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-center shadow-2xl dark:border-zinc-800"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                Ready to claim your domain?
              </h2>
              <p className="mb-8 text-lg text-blue-100">
                Join thousands of users who trust NNS for their Web3 identity
              </p>
              <motion.a
                href="/search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-zinc-100 transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                Get Started Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
