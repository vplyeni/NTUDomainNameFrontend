'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { validateDomainName, formatDomainName } from '@/lib/validation'

interface SearchBarProps {
  onSearch?: (domain: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchBar({ onSearch, placeholder = "Search for your perfect domain...", autoFocus = false }: SearchBarProps) {
  const [domain, setDomain] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) return

    setIsSearching(true)
    setError(null)
    
    // Format and validate domain
    const fullDomain = formatDomainName(domain)
    const validation = validateDomainName(fullDomain)
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid domain name')
      setIsSearching(false)
      return
    }
    
    if (onSearch) {
      onSearch(fullDomain)
    } else {
      router.push(`/search?domain=${encodeURIComponent(fullDomain)}`)
    }
    
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDomain(value)
    
    // Clear error when user starts typing again
    if (error) {
      setError(null)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="w-full max-w-3xl"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={domain}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={40}
          className={`w-full rounded-2xl border-2 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
              : 'border-zinc-200 focus:border-blue-500 focus:ring-blue-500/10 dark:border-zinc-700 dark:focus:border-blue-400'
          } bg-white py-4 pl-12 pr-32 text-lg font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 transition-colors`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSearching || !domain.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        ) : (
          <motion.p
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center"
          >
            All domains end with .ntu • Max 40 characters
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

