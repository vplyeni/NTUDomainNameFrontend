'use client'

import { useAccount, useReadContract, useBlockNumber, useChainId } from 'wagmi'
import { CONTRACT_ADDRESS, NNS_ABI } from '@/lib/contract'
import { ALP_CONTRACT_ADDRESS, ALP_ABI } from '@/lib/alpContract'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { sepolia } from 'wagmi/chains'

export default function DebugPage() {
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()
  const { data: blockNumber } = useBlockNumber({ watch: true })

  // Try to read contract owner from NNS
  const { data: nnsOwner, isError: nnsError, isLoading: nnsLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'owner',
    chainId: sepolia.id,
  })

  // Try to read token name from ALP
  const { data: alpName, isError: alpError, isLoading: alpLoading } = useReadContract({
    address: ALP_CONTRACT_ADDRESS,
    abi: ALP_ABI,
    functionName: 'name',
    chainId: sepolia.id,
  })

  // Try to read all domains
  const { data: allDomains, isError: domainsError, isLoading: domainsLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'allDomains',
    chainId: sepolia.id,
  })

  const StatusIcon = ({ isLoading, isError, data }: { isLoading: boolean; isError: boolean; data: any }) => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    if (isError) return <XCircle className="h-5 w-5 text-red-500" />
    if (data !== undefined) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-8 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            🔍 Blockchain Connection Debug
          </h1>

          {/* Wallet Connection Status */}
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Wallet Status</h2>
            <div className="space-y-2 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Connected:</span>
                <span className="font-mono text-sm">
                  {isConnected ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" /> No
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Your Address:</span>
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Network:</span>
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {chain?.name || 'Unknown'} (Chain ID: {chainId})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Expected Network:</span>
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  Sepolia (Chain ID: {sepolia.id})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Current Block:</span>
                <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {blockNumber ? blockNumber.toString() : 'Loading...'}
                </span>
              </div>
            </div>
          </div>

          {/* Network Mismatch Warning */}
          {isConnected && chainId !== sepolia.id && (
            <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                    ⚠️ Wrong Network Detected
                  </h3>
                  <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
                    Please switch to Sepolia Testnet in your wallet. Your wallet is currently on {chain?.name || 'an unknown network'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contract Configuration */}
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Contract Configuration</h2>
            <div className="space-y-2 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">NNS Contract:</span>
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                  {CONTRACT_ADDRESS}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">ALP Contract:</span>
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                  {ALP_CONTRACT_ADDRESS}
                </span>
              </div>
            </div>
          </div>

          {/* Contract Read Tests */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Contract Read Tests</h2>
            
            {/* NNS Owner Test */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon isLoading={nnsLoading} isError={nnsError} data={nnsOwner} />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">NNS Contract - Owner</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Testing: owner() function
                    </p>
                  </div>
                </div>
              </div>
              {nnsOwner && (
                <div className="mt-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  Owner: {nnsOwner}
                </div>
              )}
              {nnsError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  ❌ Failed to read from contract. Contract might not exist at this address.
                </div>
              )}
            </div>

            {/* ALP Name Test */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon isLoading={alpLoading} isError={alpError} data={alpName} />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">ALP Contract - Name</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Testing: name() function
                    </p>
                  </div>
                </div>
              </div>
              {alpName && (
                <div className="mt-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  Token Name: {alpName}
                </div>
              )}
              {alpError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  ❌ Failed to read from contract. Contract might not exist at this address.
                </div>
              )}
            </div>

            {/* All Domains Test */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon isLoading={domainsLoading} isError={domainsError} data={allDomains} />
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">NNS Contract - Domains</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Testing: allDomains() function
                    </p>
                  </div>
                </div>
              </div>
              {allDomains && (
                <div className="mt-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  Total Domains: {(allDomains as string[]).length}
                  {(allDomains as string[]).length > 0 && (
                    <div className="mt-1">
                      Domains: {(allDomains as string[]).join(', ')}
                    </div>
                  )}
                </div>
              )}
              {domainsError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  ❌ Failed to read from contract.
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Diagnosis</h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
              {!isConnected && <li>• Please connect your wallet first</li>}
              {isConnected && chainId !== sepolia.id && <li>• Switch to Sepolia network in your wallet</li>}
              {nnsError && <li>• NNS contract cannot be read - verify deployment</li>}
              {alpError && <li>• ALP contract cannot be read - verify deployment</li>}
              {!nnsError && !alpError && nnsOwner && alpName && (
                <li className="text-green-600 dark:text-green-400">✓ All contracts are working correctly!</li>
              )}
            </ul>
          </div>

          {/* Help Section */}
          <div className="mt-6 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Need Help?</h3>
            <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <li>1. Make sure you're connected to Sepolia Testnet</li>
              <li>2. Check that contract addresses in .env.local are correct</li>
              <li>3. Verify contracts are deployed: <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View NNS on Etherscan</a></li>
              <li>4. Get test ETH from: <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sepolia Faucet</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


