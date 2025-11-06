import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, NNS_ABI } from './contract';

export function useIsOwner() {
  const { address, isConnected } = useAccount();
  
  const { data: contractOwner, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NNS_ABI,
    functionName: 'owner',
  });

  const isOwner = isConnected && address && contractOwner && 
    address.toLowerCase() === contractOwner.toLowerCase();

  return {
    isOwner: !!isOwner,
    isLoading,
    contractOwner
  };
}

