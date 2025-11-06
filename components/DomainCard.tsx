'use client'

import { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { formatDistance } from 'date-fns'

interface DomainCardProps {
  name: string
  owner?: string
  expiryDate?: number
  registrationDate?: number
  isAvailable?: boolean
  onAction?: () => void
  actionLabel?: string
  isActive?: boolean
}

export const DomainCard = memo(function DomainCard({
  name,
  owner,
  expiryDate,
  registrationDate,
  isAvailable = false,
  onAction,
  actionLabel = 'Register',
  isActive = true
}: DomainCardProps) {
  
  const formatAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  const expiryStatus = useMemo(() => {
    if (!expiryDate) return null
    const now = Date.now() / 1000
    const timeLeft = expiryDate - now
    
    if (timeLeft < 0) return { label: 'Expired', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/20' }
    if (timeLeft < 30 * 24 * 60 * 60) return { label: 'Expiring Soon', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20' }
    return { label: 'Active', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950/20' }
  }, [expiryDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {name}
            </h3>
            {expiryStatus && (
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${expiryStatus.bgColor} ${expiryStatus.color}`}>
                {expiryStatus.label === 'Active' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {expiryStatus.label}
              </span>
            )}
          </div>
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              <XCircle className="h-3 w-3" />
              Taken
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4">
          {owner && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Owner:</span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-50">
                {formatAddress(owner)}
              </span>
            </div>
          )}
          
          {registrationDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Registered:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatDistance(new Date(registrationDate * 1000), new Date(), { addSuffix: true })}
              </span>
            </div>
          )}
          
          {expiryDate && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-600 dark:text-zinc-400">Expires:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {formatDistance(new Date(expiryDate * 1000), new Date(), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
})

