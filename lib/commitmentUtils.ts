import { encodeAbiParameters, parseAbiParameters, keccak256, parseEther } from 'viem'

/**
 * Storage structure for a single bid
 */
export interface BidData {
  domain: string
  bidAmount: string // In ETH
  secretText: string // Original human-readable secret text
  secret: string // bytes32 hash of the secret text (0x-prefixed hex string)
  commitment: string // The calculated commitment hash
  timestamp: number
}

/**
 * Generate a cryptographically secure random secret (32 bytes)
 */
export function generateSecret(): `0x${string}` {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  return ('0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')) as `0x${string}`
}

/**
 * Generate a random human-readable secret text
 */
export function generateSecretText(): string {
  const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'theta', 'lambda']
  const randomWord1 = words[Math.floor(Math.random() * words.length)]
  const randomWord2 = words[Math.floor(Math.random() * words.length)]
  const randomNum = Math.floor(Math.random() * 10000)
  return `${randomWord1}-${randomWord2}-${randomNum}`
}

/**
 * Hash text to bytes32 (for use as secret)
 * This converts any text string to a proper bytes32 hash
 */
export function hashSecretText(text: string): `0x${string}` {
  // Convert text to bytes and hash it
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hexString = '0x' + Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('')
  return keccak256(hexString as `0x${string}`)
}

/**
 * Calculate commitment hash matching Solidity's abi.encode
 * 
 * Solidity code:
 * ```solidity
 * function makeCommitment(
 *   string memory name,
 *   uint256 bidAmount,
 *   bytes32 secret,
 *   address bidder
 * ) public pure returns (bytes32) {
 *   return keccak256(abi.encode(name, bidAmount, secret, bidder));
 * }
 * ```
 */
export function makeCommitment(
  domain: string,
  bidAmountEth: string,
  secret: `0x${string}`,
  bidderAddress: `0x${string}`
): `0x${string}` {
  // Parse ETH to wei (uint256)
  const bidAmountWei = parseEther(bidAmountEth)
  
  // Encode parameters matching Solidity's abi.encode(string, uint256, bytes32, address)
  const encoded = encodeAbiParameters(
    parseAbiParameters('string, uint256, bytes32, address'),
    [domain, bidAmountWei, secret, bidderAddress]
  )
  
  // Hash the encoded data
  return keccak256(encoded)
}

/**
 * Store a new bid in localStorage
 * Supports multiple bids per domain - stores all of them
 */
export function storeBid(bidData: BidData): void {
  const stored = localStorage.getItem('nns_bids')
  const bids: BidData[] = stored ? JSON.parse(stored) : []
  
  // Add new bid
  bids.push(bidData)
  
  localStorage.setItem('nns_bids', JSON.stringify(bids))
}

/**
 * Get all bids for a specific domain
 */
export function getBidsForDomain(domain: string): BidData[] {
  const stored = localStorage.getItem('nns_bids')
  if (!stored) return []
  
  const bids: BidData[] = JSON.parse(stored)
  return bids.filter(bid => bid.domain === domain)
}

/**
 * Get the highest bid for a specific domain
 * Returns the bid with the highest bidAmount
 */
export function getHighestBid(domain: string): BidData | null {
  const bids = getBidsForDomain(domain)
  if (bids.length === 0) return null
  
  return bids.reduce((highest, current) => {
    const highestAmount = parseFloat(highest.bidAmount)
    const currentAmount = parseFloat(current.bidAmount)
    return currentAmount > highestAmount ? current : highest
  })
}

/**
 * Get all stored bids (for all domains)
 */
export function getAllBids(): BidData[] {
  const stored = localStorage.getItem('nns_bids')
  return stored ? JSON.parse(stored) : []
}

/**
 * Clear all bids from storage
 */
export function clearAllBids(): void {
  localStorage.removeItem('nns_bids')
}

/**
 * Remove a specific bid
 */
export function removeBid(commitment: string): void {
  const stored = localStorage.getItem('nns_bids')
  if (!stored) return
  
  const bids: BidData[] = JSON.parse(stored)
  const filtered = bids.filter(bid => bid.commitment !== commitment)
  
  localStorage.setItem('nns_bids', JSON.stringify(filtered))
}

