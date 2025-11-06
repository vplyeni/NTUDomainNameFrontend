# Owner Panel Documentation

## Overview
The Owner Panel is a secure administrative interface that allows the contract owner to manage which domains can be auctioned on the NNS platform.

## Access Control
- **Visibility**: The "Owner" tab appears in the navigation menu ONLY when:
  1. A wallet is connected
  2. The connected wallet address matches the contract owner address
  
- **Security**: The page performs multiple checks:
  1. Wallet connection status
  2. Owner verification via smart contract
  3. Access denied screen for non-owners

## Features

### 1. Add Single Domain
Allows adding one domain at a time to the auctionable list.

**Features:**
- Real-time domain validation
- Must end with `.ntu`
- Length: 5-40 characters
- Duplicate prevention (contract-level)

**How to use:**
1. Enter domain name (e.g., `computer.ntu`)
2. Click "Add Domain"
3. Confirm transaction in wallet
4. Wait for confirmation

### 2. Add Batch Domains
Efficiently add multiple domains at once.

**Features:**
- Add up to many domains in a single transaction
- One domain per line
- Automatic validation for all domains
- Skips duplicates automatically
- Lower gas costs compared to multiple single additions

**How to use:**
1. Enter domains (one per line):
   ```
   computer.ntu
   science.ntu
   engineering.ntu
   ```
2. Click "Add Batch"
3. Confirm transaction
4. Wait for confirmation

### 3. Search Domains
Powerful fuzzy search to find domains in the auctionable list.

**Features:**
- **Case-insensitive** search
- **Substring matching** (partial matches)
- **Real-time** results
- **No gas cost** (view function)

**Examples:**
- Search `"tech"` → finds `biotech.ntu`, `fintech.ntu`, `technology.ntu`
- Search `"UNI"` → finds `university.ntu`, `reunion.ntu`, `unique.ntu`
- Search `"comp"` → finds `computer.ntu`, `compscience.ntu`

### 4. View All Domains
See the complete list of auctionable domains.

**Features:**
- Scrollable list
- Total count display
- Remove option for each domain
- Auto-refresh after modifications

### 5. Remove Domains
Remove domains from the auctionable list.

**Features:**
- One-click removal
- Confirmation via transaction
- Updates list automatically
- Prevents future auctions for removed domains

**How to use:**
1. Find the domain in the list (use search if needed)
2. Click "Remove" button
3. Confirm transaction
4. Wait for confirmation

## UI Components

### Status Messages
- **Error Messages** (Red): Validation errors, transaction failures
- **Success Messages** (Green): Successful transactions
- **Auto-dismiss**: Messages disappear after 5 seconds

### Loading States
- Transaction pending indicators
- Spinning loader animations
- Disabled buttons during processing

### Visual Hierarchy
- **Add Single Domain**: Blue theme
- **Add Batch**: Green theme
- **Search/List**: Purple theme
- **Owner Badge**: Amber/Gold crown icon

## Technical Implementation

### Hook: `useIsOwner()`
Location: `/lib/useIsOwner.ts`

```typescript
const { isOwner, isLoading, contractOwner } = useIsOwner()
```

**Returns:**
- `isOwner`: Boolean - true if connected user is owner
- `isLoading`: Boolean - loading state
- `contractOwner`: Address - the contract owner's address

### Contract Functions Used

#### Write Functions (require transactions)
1. `addAuctionableDomain(string)` - Add single domain
2. `addAuctionableDomainsBatch(string[])` - Add multiple domains
3. `removeAuctionableDomain(string)` - Remove domain

#### Read Functions (no gas cost)
1. `getAllAuctionableDomains()` - Get all domains
2. `searchAuctionableDomains(string)` - Search domains
3. `isAuctionable(string)` - Check if domain is auctionable
4. `owner()` - Get contract owner address

### State Management
- React hooks for local state
- Wagmi hooks for blockchain interaction
- Automatic refetch after successful transactions
- Optimistic UI updates

## User Flow

### First Time Setup
1. Deploy contract (you become owner)
2. Connect wallet to frontend
3. Notice "Owner" tab appears in navigation
4. Click "Owner" tab
5. Add initial domains (use batch for efficiency)

### Regular Management
1. Monitor domain list
2. Add new domains as needed
3. Remove domains that shouldn't be auctionable
4. Use search to quickly find specific domains

### User Perspective (Non-owners)
- Do NOT see "Owner" tab
- Can only auction domains that are in the auctionable list
- See "domain not in auctionable list" error if trying to auction non-whitelisted domain

## Best Practices

### For Owners

1. **Batch Addition**: Use batch function when adding multiple domains
   - More efficient
   - Lower gas costs
   - Faster setup

2. **Domain Naming**:
   - Use consistent naming conventions
   - Consider categories (tech, science, art, etc.)
   - Make domains memorable and relevant

3. **Regular Maintenance**:
   - Review auctionable list periodically
   - Remove inappropriate domains
   - Add popular requested domains

4. **Gas Optimization**:
   - Add domains in batches of 10-50
   - Remove domains during low gas periods
   - Plan additions during network off-peak hours

### Security Considerations

1. **Owner Key Security**:
   - Keep owner wallet seed phrase secure
   - Consider multi-sig wallet for production
   - Never share private keys

2. **Smart Contract**:
   - Owner functions are protected by `onlyOwner` modifier
   - Non-owners cannot modify the auctionable list
   - All changes are permanent and recorded on blockchain

3. **Validation**:
   - All domains validated before submission
   - Contract-level validation as second layer
   - Duplicate prevention built-in

## Troubleshooting

### "Owner" tab not appearing
- **Cause**: Not connected or not the owner
- **Solution**: Connect the owner wallet

### Transaction Failing
- **Possible Causes**:
  - Insufficient gas
  - Invalid domain format
  - Domain already in list (for add)
  - Domain not in list (for remove)
- **Solution**: Check error message, verify domain format, ensure sufficient ETH for gas

### Search not working
- **Cause**: Contract not deployed or wrong address
- **Solution**: Check `CONTRACT_ADDRESS` in `.env.local`

### "Access Denied" screen
- **Cause**: Connected wallet is not the owner
- **Solution**: Connect the owner wallet or contact contract owner

## Gas Estimates

Approximate gas costs (varies by network conditions):

- **Add Single Domain**: ~50,000-80,000 gas
- **Add Batch (10 domains)**: ~200,000-400,000 gas
- **Remove Domain**: ~30,000-50,000 gas
- **View/Search**: FREE (read-only)

## Events

All modifications emit events for tracking:

```solidity
event AuctionableDomainAdded(string indexed name);
event AuctionableDomainRemoved(string indexed name);
```

These can be monitored using:
- Block explorers (Etherscan, etc.)
- Event listeners in frontend
- Indexing services (The Graph)

## Future Enhancements

Potential improvements:
1. CSV upload for batch additions
2. Domain categories/tags
3. Auction analytics dashboard
4. Automated domain suggestions
5. Domain reservation system
6. Multi-owner support (via multi-sig)

## Support

For issues or questions:
1. Check this documentation
2. Review contract events on block explorer
3. Verify wallet connection
4. Check console for errors
5. Ensure contract is properly deployed

## Example Workflow

### Launch Day Preparation
```typescript
// 1. Add popular domain categories
const domains = [
  // Tech domains
  "computer.ntu",
  "software.ntu",
  "hardware.ntu",
  "ai.ntu",
  
  // Science domains
  "physics.ntu",
  "chemistry.ntu",
  "biology.ntu",
  
  // General domains
  "news.ntu",
  "blog.ntu",
  "shop.ntu"
]

// 2. Use batch function (one transaction)
await addAuctionableDomainsBatch(domains)

// 3. Verify additions
const all = await getAllAuctionableDomains()
console.log(`Added ${all.length} domains`)
```

### Weekly Maintenance
```typescript
// 1. Check current domains
const current = await getAllAuctionableDomains()

// 2. Search for specific category
const techDomains = await searchAuctionableDomains("tech")

// 3. Add new requested domains
await addAuctionableDomain("newtech.ntu")

// 4. Remove if needed
await removeAuctionableDomain("spam.ntu")
```

## Keyboard Shortcuts

None implemented yet, but consider:
- `Cmd/Ctrl + K`: Focus search
- `Cmd/Ctrl + N`: Focus add domain
- `Esc`: Clear forms

## Responsive Design

The owner panel is fully responsive:
- **Desktop**: Two-column layout for add functions
- **Tablet**: Stacked layout
- **Mobile**: Full-width cards

## Accessibility

Features included:
- Semantic HTML
- Keyboard navigation
- Screen reader friendly labels
- Color contrast compliance
- Loading state announcements

## Version History

### v1.0.0 (Current)
- Initial release
- Add single domain
- Add batch domains
- Remove domains
- Fuzzy search
- View all domains
- Access control
- Responsive design

