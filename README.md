# 😄 Jokes - Farcaster Miniapp

A vibrant, fluorescent-themed Farcaster miniapp where users can share jokes, vote on their favorites, and compete on the leaderboard!

## ✨ Features

- 🎨 **Fluorescent Color Theme** - Eye-catching neon colors with glow effects
- 📱 **Mobile-First Design** - Optimized for mobile with responsive layout
- 🔗 **Multi-Wallet Support** - Connect with Farcaster Wallet, MetaMask, Coinbase Wallet, or WalletConnect
- 😄 **Joke Sharing** - Submit and share your funniest jokes
- 👍👎 **Voting System** - Upvote and downvote jokes
- 🗺️ **Quest System** - Complete quests and earn Punny Power
- 🏆 **Leaderboard** - Compete for the top spot
- 🚀 **Share Integration** - Easy joke sharing via Web Share API
- 🎬 **Motion Effects** - Smooth animations and transitions
- 🔊 **Sound Effects** - Interactive audio feedback (optional)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Next.js 15** - App framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom theme
- **Reown AppKit** - Wallet connection (formerly WalletConnect)
- **Wagmi** - Ethereum React hooks
- **Neynar SDK** - Farcaster integration
- **TanStack Query** - Data fetching

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JesterInvestor/jokes.git
cd jokes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Get a Reown Project ID from [https://cloud.reown.com](https://cloud.reown.com) and add it to `.env.local`:
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages

### Home (😄)
- Browse and vote on jokes
- Upvote/downvote functionality
- Share jokes with friends
- Connect wallet to interact

### Write (✍️)
- Submit new jokes
- 280 character limit
- Tips for great jokes
- Share functionality

### Quests (🗺️)
- Complete challenges to earn Punny Power
- View progress on various quests
- Leaderboard showing top comedians
- Badge system for achievements

### Info (ℹ️)
- About the app
- How it works guide
- Features overview
- Tech stack details
- Coming soon features

## 🎨 Color Theme

The app uses a vibrant fluorescent color palette:
- **Cyan** - `#00FFFF` - Primary accent
- **Pink** - `#FF00FF` - Secondary accent
- **Yellow** - `#FFFF00` - Highlights
- **Green** - `#00FF00` - Success states
- **Orange** - `#FF6600` - Warnings
- **Purple** - `#9D00FF` - Special features

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🚧 Coming Soon

- Backend integration for persistent storage
- Farcaster authentication via Neynar
- Real-time leaderboard updates
- NFT rewards for top comedians
- Daily joke challenges
- Custom emoji reactions

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

Built with love for the Farcaster community! 💜
