# 🚀 Quick Setup Guide for NNS Frontend

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Getting Your Contract Address
1. Deploy the `NTUDomainName.sol` contract to your preferred network
2. Copy the deployed contract address
3. Paste it in `.env.local`

### Getting WalletConnect Project ID (Optional)
1. Go to https://cloud.walletconnect.com
2. Create a free account
3. Create a new project
4. Copy the Project ID
5. Paste it in `.env.local`

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 4: Connect Your Wallet

1. Click "Connect Wallet" in the top-right
2. Select MetaMask or WalletConnect
3. Approve the connection
4. Make sure you're on the correct network (where your contract is deployed)

## Step 5: Test the Application

### Search for a Domain
1. Go to the Search page
2. Enter a domain name (e.g., "test")
3. Click Search
4. If available, you can start an auction

### Complete an Auction
1. Click "Start Auction"
2. Wait for transaction confirmation
3. Enter your bid amount and click "Commit Bid"
4. Wait for commit phase to end (based on your contract's `commitPhaseDuration`)
5. Click "Reveal Bid"
6. Wait for reveal phase to end
7. Click "Finalize Auction"
8. Check "My Domains" to see your new domain!

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Runtime Errors
- Check contract address is correct in `.env.local`
- Ensure you're on the correct network in MetaMask
- Check browser console for detailed error messages

### Transaction Failures
- Ensure you have enough ETH for gas
- Check contract functions are callable
- Verify auction phase timings

## Network Configuration

To add or modify supported networks, edit `lib/wagmi.ts`:

```typescript
import { mainnet, sepolia, hardhat, polygon } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat, polygon], // Add your networks here
  // ...
})
```

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.

