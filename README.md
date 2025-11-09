# NNS - NTU Name Service Frontend

A modern, decentralized domain name service platform for `.ntu` domains built with Next.js, featuring a secure blind auction registration system and blockchain integration.

## 🚀 Project Overview

NTU Name Service (NNS) is a Web3 application that allows users to register, manage, and trade `.ntu` domains on the blockchain. The platform implements a secure blind auction mechanism (commit-reveal) for fair domain registration.

### Key Features

- **🔒 Secure Blind Auction System**: Commit-reveal mechanism ensures fair bidding without revealing bid amounts upfront
- **⚡ Instant Resolution**: Resolve `.ntu` domains to Ethereum addresses instantly on-chain
- **🌐 Full Ownership**: Complete domain ownership with transfer and renewal capabilities
- **💎 Modern UI/UX**: Beautiful, fast, and intuitive interface with smooth animations
- **📱 Responsive Design**: Works seamlessly across all devices
- **🔗 Web3 Integration**: Built with Wagmi for seamless blockchain interactions

## 📋 Prerequisites

Make sure you have the following installed on your system:

- **Node.js**: `v20.16.0` (or higher)
- **npm**: `10.8.1` (or higher)

You can verify your versions by running:
```bash
node --version
npm --version
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.0.1](https://nextjs.org/) - React framework with server-side rendering
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Web3**: 
  - [Wagmi 2.19.1](https://wagmi.sh/) - React Hooks for Ethereum
  - [Viem 2.38.5](https://viem.sh/) - TypeScript Interface for Ethereum
- **State Management**: [@tanstack/react-query 5.90.5](https://tanstack.com/query) - Powerful async state management
- **Animations**: [Framer Motion 12.23.24](https://www.framer.com/motion/) - Production-ready motion library
- **Icons**: [Lucide React 0.548.0](https://lucide.dev/) - Beautiful & consistent icons
- **Date Handling**: [date-fns 4.1.0](https://date-fns.org/) - Modern JavaScript date utility library

## 📦 Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd bc_project/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
npm run build
```

This command:
- Compiles TypeScript
- Optimizes and bundles all assets
- Generates static pages where possible
- Removes console logs in production
- Optimizes images and CSS

### Start Production Server

After building, start the production server:

```bash
npm run start
```

The production server will run at [http://localhost:3000](http://localhost:3000)

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📄 Available Pages

The application includes the following pages:

- **`/`** - Landing page with domain search and feature showcase
- **`/search`** - Advanced domain search interface
- **`/auctions`** - Browse and participate in domain auctions
- **`/my-domains`** - Manage your owned domains
- **`/owner`** - Owner/admin dashboard
- **`/send-tokens`** - Token transfer functionality
- **`/debug`** - Development debugging tools

## 🎨 Landing Page Features

The landing page (`/`) includes:

### Hero Section
- Prominent search bar for domain lookup
- Eye-catching gradient animations
- Project overview and tagline
- Key statistics display (auction duration, renewal period, domain ownership)

### Feature Highlights
- **Secure Blind Auction**: Commit-reveal mechanism for fair bidding
- **Instant Resolution**: On-chain domain resolution
- **Full Ownership**: Complete control with transfer and renewal capabilities
- **Modern Platform**: Built with cutting-edge web technologies

### Additional Sections
- **How It Works**: Step-by-step guide for domain registration
- **User Interface Guide**: Interactive tutorial for navigating the platform
- **Architecture Overview**: Technical implementation details
- **Technical Specifications**: Smart contract and blockchain information
- **Frequently Asked Questions (FAQ)**: Common questions and answers

### Interactive Elements
- Domain search with real-time validation
- Smooth scroll animations using Framer Motion
- Collapsible sections for detailed information
- Responsive design adapting to all screen sizes

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with metadata
│   ├── providers.tsx      # React Query & Web3 providers
│   ├── globals.css        # Global styles
│   ├── auctions/          # Auctions page
│   ├── my-domains/        # User domains management
│   ├── owner/             # Owner dashboard
│   ├── search/            # Domain search page
│   ├── send-tokens/       # Token transfer page
│   └── debug/             # Debug tools
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── SearchBar.tsx      # Domain search component
│   └── DomainCard.tsx     # Domain display card
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## ⚙️ Configuration

### Next.js Configuration

The project uses custom Next.js configuration (`next.config.ts`) with:
- React Strict Mode enabled
- Console removal in production builds
- Image optimization (AVIF and WebP formats)
- CSS optimization (experimental)

### Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables (if needed):

```env
# Add your environment variables here
# NEXT_PUBLIC_CHAIN_ID=your_chain_id
# NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

## 🌐 Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use ESLint configuration for code consistency
- Implement responsive design using Tailwind CSS
- Optimize images and assets before adding to `public/`
- Use React Hooks and functional components
- Leverage Next.js features (SSR, SSG, API routes)

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can:
- Stop the process using port 3000
- Or specify a different port:
  ```bash
  PORT=3001 npm run dev
  ```

### Build Errors

If you encounter build errors:
1. Delete `.next` folder: `rm -rf .next`
2. Clear node modules: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Try building again: `npm run build`

### Web3 Connection Issues

Ensure you have:
- A Web3 wallet installed (e.g., MetaMask)
- Connected to the correct network
- Sufficient funds for transactions

## 📦 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- **Netlify**: Supports Next.js with adapter
- **AWS Amplify**: Full Next.js support
- **Docker**: Use the official Next.js Docker image

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment.

## 🆘 Support

For issues, questions, or contributions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ using Next.js and Web3 technologies**

