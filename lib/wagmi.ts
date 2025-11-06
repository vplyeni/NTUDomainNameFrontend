'use client'

import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Get RPC URLs from environment or use defaults
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'

export const config = createConfig({
  chains: [sepolia, mainnet, hardhat],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
    [mainnet.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

