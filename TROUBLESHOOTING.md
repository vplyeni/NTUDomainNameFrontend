# 🔧 Troubleshooting Connection Issues

## Problem: Can connect wallet but cannot retrieve blockchain data

This usually happens due to one of these issues:

### 1. **Wrong Network** ❌
**Symptoms:** Wallet connects but nothing loads, no domains show up

**Solution:**
- Open MetaMask
- Click the network dropdown at the top
- Select "Sepolia test network"
- Refresh the page

---

### 2. **Contracts Not Deployed** ❌
**Symptoms:** All reads fail, error messages in console

**Solution:**
- Verify contracts are deployed on Sepolia
- Check on Etherscan:
  - NNS: https://sepolia.etherscan.io/address/0xe3290dFdf6bD99D46925cE3c6B06c21fdba8De6a
  - ALP: https://sepolia.etherscan.io/address/0xc8c41a371Ce33e7A9ec87D5Fcd4372dee0dd1058
- If contract code doesn't show, you need to redeploy

---

### 3. **RPC Issues** ❌
**Symptoms:** Slow loading, timeout errors

**Current RPC:** `https://ethereum-sepolia-rpc.publicnode.com`

**Alternative RPCs to try:**

```env
# Alchemy (requires signup)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Infura (requires signup)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Chainstack (free tier)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia.blockpi.network/v1/rpc/public

# Ankr (free)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.ankr.com/eth_sepolia
```

Update `.env.local` and restart: `npm run dev`

---

### 4. **Wrong Contract Addresses** ❌
**Symptoms:** Contract not found errors

**Check your `.env.local`:**

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe3290dFdf6bD99D46925cE3c6B06c21fdba8De6a
NEXT_PUBLIC_ALP_CONTRACT_ADDRESS=0xc8c41a371Ce33e7A9ec87D5Fcd4372dee0dd1058
```

Make sure these match your deployment addresses in `contracts.txt`

---

## 🔍 Debug Page

Visit **http://localhost:3000/debug** to see:
- ✅ Wallet connection status
- ✅ Current network vs expected network
- ✅ Contract read tests
- ✅ Real-time diagnosis

This page will tell you exactly what's wrong!

---

## 📋 Quick Checklist

Before debugging further, verify:

- [ ] Wallet is connected
- [ ] You're on **Sepolia Testnet** (not mainnet or other networks)
- [ ] You have some test ETH (get from https://sepoliafaucet.com)
- [ ] `.env.local` exists with correct contract addresses
- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console shows no errors (F12 to open)

---

## 🐛 Common Errors & Solutions

### Error: "Chain mismatch"
→ Switch to Sepolia in MetaMask

### Error: "Contract not found"
→ Verify contract addresses in `.env.local`

### Error: "Execution reverted"
→ Check if contract is initialized properly (owner set, etc.)

### Error: "Cannot read properties of undefined"
→ Wait for wallet connection to complete

### Error: "User rejected the request"
→ You cancelled the transaction in MetaMask

---

## 🔬 Advanced Debugging

### Check Contract Deployment

```bash
# From backend directory
cd /Users/yurdasenalpyeni/Desktop/bc_project/backend
npx hardhat verify --network sepolia 0xe3290dFdf6bD99D46925cE3c6B06c21fdba8De6a
```

### Test Contract Calls Directly

```bash
# Using cast (from Foundry)
cast call 0xe3290dFdf6bD99D46925cE3c6B06c21fdba8De6a "owner()" --rpc-url https://ethereum-sepolia-rpc.publicnode.com
```

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Copy and search for the error message

---

## 📞 Still Stuck?

1. Go to `/debug` page and screenshot the results
2. Check browser console for errors (F12)
3. Verify contract addresses on Etherscan
4. Make sure you're actually on Sepolia testnet

---

## 💡 Pro Tips

- **Clear cache:** Sometimes Next.js cache causes issues
  ```bash
  rm -rf .next
  npm run dev
  ```

- **Check environment variables are loaded:**
  - Add `console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)` in any component
  - Should show your contract address, not `undefined`

- **Network switching:**
  - Some wallets cache network data
  - Try disconnecting and reconnecting your wallet

- **MetaMask issues:**
  - Clear MetaMask activity data: Settings → Advanced → Clear activity tab data
  - Reset account: Settings → Advanced → Reset account

---

## ✅ Verification Steps

After fixing, verify everything works:

1. Visit `/debug` - All checks should be green ✅
2. Visit `/search` - Search should work
3. Visit `/auctions` - Auctions should load
4. Visit `/my-domains` - Your domains should appear (if you own any)

---

**Most Common Issue:** Wrong network! Make sure you're on Sepolia! 🦊

