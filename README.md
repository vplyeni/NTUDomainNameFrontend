# NNS - NTU Name Service Frontend

A modern, animated Web3 frontend for the NTU Domain Name Service built with Next.js 16, React 19, Wagmi, and Framer Motion.

![NNS Banner](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Wagmi](https://img.shields.io/badge/Wagmi-Latest-green?style=for-the-badge)

## 🚀 Features

- **🔍 Domain Search**: Search and check availability of .ntu domains
- **🎯 Blind Auction System**: Fair domain registration through commit-reveal mechanism
- **💼 Domain Management**: View, transfer, and renew your domains
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⚡ Real-time Updates**: Live blockchain data integration
- **🔐 Wallet Integration**: Support for MetaMask and WalletConnect
- **🌙 Dark Mode**: Full dark mode support

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- MetaMask or compatible Web3 wallet
- Deployed NTUDomainName smart contract

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd /Users/yurdasenalpyeni/Desktop/bc_project/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Your deployed contract address
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   
   # WalletConnect Project ID (get from https://cloud.walletconnect.com)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Update contract address**
   
   Edit `lib/contract.ts` and update the `CONTRACT_ADDRESS` default value or use the environment variable.

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── search/            # Domain search page
│   ├── my-domains/        # User's domains dashboard
│   ├── auctions/          # Active auctions listing
│   ├── layout.tsx         # Root layout with providers
│   ├── providers.tsx      # Web3 providers configuration
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation and wallet connection
│   ├── SearchBar.tsx      # Domain search component
│   └── DomainCard.tsx     # Domain display card
├── lib/                   # Utilities and configurations
│   ├── contract.ts        # Contract ABI and address
│   └── wagmi.ts          # Wagmi configuration
└── public/               # Static assets
```

## 🎯 Key Pages

### Landing Page (`/`)
- Hero section with animated background
- Feature showcase
- Quick domain search
- Call-to-action sections

### Search Page (`/search`)
- Domain availability checker
- Blind auction workflow:
  1. Start Auction
  2. Commit Bid (sealed bid)
  3. Reveal Bid
  4. Finalize Auction
- Real-time status updates

### My Domains (`/my-domains`)
- View all owned domains
- Transfer domains to other addresses
- Renew expired domains (within 90-day grace period)
- Domain status indicators

### Auctions (`/auctions`)
- Browse all registered domains
- View auction details
- Quick navigation to domain pages

## 🔧 Smart Contract Integration

The frontend integrates with the NTUDomainName smart contract through:

- **Wagmi v2**: Modern React hooks for Ethereum
- **Viem**: Type-safe Ethereum interactions
- **React Query**: Efficient data fetching and caching

### Key Contract Functions

- `available(name)`: Check domain availability
- `startAuction(name)`: Initiate blind auction
- `commitBid(name, commitment)`: Submit sealed bid
- `revealBid(name, bidAmount, secret)`: Reveal bid
- `finalize(name)`: Complete auction
- `transferDomain(name, to)`: Transfer ownership
- `renewDomain(name)`: Renew expired domain
- `reverseResolve(address)`: Get domains by owner

## 🎨 Technologies Used

### Frontend Framework
- **Next.js 16**: App router, server components
- **React 19**: Latest React features
- **TypeScript 5**: Type safety

### Web3 Integration
- **Wagmi v2**: React hooks for Ethereum
- **Viem 2.x**: TypeScript Ethereum library
- **TanStack Query**: Data fetching and caching

### UI/UX
- **Tailwind CSS 4**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons
- **date-fns**: Date formatting

## 🔐 Wallet Support

- MetaMask (Injected)
- WalletConnect
- Any EIP-6963 compatible wallet

## 🌐 Supported Networks

Currently configured for:
- Ethereum Mainnet
- Sepolia Testnet
- Hardhat Local Network (localhost:8545)

Update `lib/wagmi.ts` to add more networks.

## 📝 Usage Guide

### Registering a Domain

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Search Domain**: Enter your desired domain name (e.g., "myname")
3. **Start Auction**: If available, click "Start Auction"
4. **Commit Bid**: 
   - Enter your bid amount in ETH
   - Click "Commit Bid" (your secret is auto-generated)
   - Wait for commit phase to end
5. **Reveal Bid**:
   - After commit phase, click "Reveal Bid"
   - Your bid data is automatically loaded from localStorage
6. **Finalize**: 
   - After reveal phase ends, click "Finalize Auction"
   - Winner receives the domain!

### Managing Domains

1. Navigate to **My Domains** page
2. View all your registered domains
3. **Transfer**: Click transfer icon, enter recipient address
4. **Renew**: If expired (within 90 days), click renew icon

## ⚠️ Important Notes

- **Bid Secret**: Your bid secret is saved in localStorage. Don't clear it before revealing!
- **Renewal Window**: You have 90 days after expiry to renew
- **Renewal Fee**: Equals your original winning bid amount
- **Gas Fees**: All transactions require gas fees in the network's native token

## 🐛 Troubleshooting

### "Transaction Failed"
- Check you have enough ETH for gas fees
- Ensure auction phases are in correct state
- Verify contract address is correct

### "Wallet Not Connected"
- Check MetaMask is installed and unlocked
- Try refreshing the page
- Clear browser cache if issues persist

### "Domain Not Showing"
- Wait for transaction confirmation
- Refresh the page
- Check the correct network is selected

## 🤝 Contributing

This is a demo project. Feel free to fork and modify!

## 📄 License

MIT License - feel free to use this code for your projects.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Framer Motion](https://www.framer.com/motion)

## 💡 Tips

1. **Test on Testnet First**: Always test on Sepolia or other testnets before mainnet
2. **Save Bid Data**: Don't clear localStorage during auction participation
3. **Check Auction Phases**: Ensure you're in the correct phase (commit/reveal)
4. **Monitor Gas**: Transaction costs vary by network congestion

---

Built with ❤️ using Next.js, React, and Web3 technologies.
# NTUDomainName
# NTUDomainNameFrontend
