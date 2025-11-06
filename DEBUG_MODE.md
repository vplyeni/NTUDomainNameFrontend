# Debug Mode Configuration

## Overview

The Debug tab in the navigation can now be controlled via an environment variable. This allows you to hide or show the Debug panel based on your environment (development, staging, production).

## Environment Variable

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

## Usage

### Enable Debug Tab (Default)
Set the environment variable to `true`:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
```

### Disable Debug Tab
Set the environment variable to `false` or remove it entirely:
```bash
NEXT_PUBLIC_DEBUG_MODE=false
```

## Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set `NEXT_PUBLIC_DEBUG_MODE` to your preferred value

3. Restart your Next.js development server for changes to take effect:
   ```bash
   npm run dev
   ```

## Notes

- The `NEXT_PUBLIC_` prefix is required for environment variables that are accessed in client-side code
- Changes to `.env.local` require a server restart
- `.env.local` is git-ignored by default and should not be committed
- `.env.example` is tracked in git as a template for other developers

## Debug Page Features

The Debug page (`/app/debug/page.tsx`) provides:
- Wallet connection status
- Network verification (Sepolia)
- Contract address configuration
- Contract read tests for NNS and ALP contracts
- Domain listing
- Helpful diagnostics and troubleshooting links

Even when the Debug tab is hidden from navigation, the page can still be accessed directly at `/debug` if needed.

