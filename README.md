# WalletWatcher

A simple tool to monitor cryptocurrency wallet addresses and track balance changes.

## Features

- Monitor multiple wallet addresses
- Track balance changes in real-time
- Support for Ethereum and BSC networks
- Simple web interface
- Add/delete wallet addresses
- Real-time balance checking via blockchain APIs

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your API keys for Etherscan and BSCScan
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter a wallet address (must start with 0x)
2. Select the network (Ethereum or BSC)
3. Click "Add Wallet" to start monitoring
4. Use "Check Balance" to get current balance
5. Delete wallets you no longer want to monitor

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: SQLite
- APIs: Etherscan, BSCScan

## API Keys Required

- Etherscan API: https://etherscan.io/apis
- BSCScan API: https://bscscan.com/apis