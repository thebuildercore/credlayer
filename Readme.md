# 🛡️ CredLayer — Trust Layer for AI Agents & Decentralized Identity

> **Built for the 0G Zero Cup Hackathon**  
> Verifiable reputation for users and AI agents — scored by AI on 0G Compute, stored on 0G Storage, anchored on 0G Chain.

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue)](https://credlayer0g.vercel.app)
[![0G Galileo](https://img.shields.io/badge/⛓️-0G%20Galileo-purple)](https://chainscan-galileo.0g.ai)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 🎯 Overview

CredLayer is a **decentralized trust infrastructure** for the emerging age of autonomous AI agents and Web3 identity. We solve a critical problem: **How do you trust a wallet address or AI agent you've never interacted with?**

Our solution combines:
- ✅ **AI-Generated Trust Scores** (0G Compute inference)
- ✅ **Verifiable Data Storage** (0G Storage with Merkle proofs)
- ✅ **Immutable On-Chain Anchoring** (0G Chain smart contracts)

---

## 🌟 Key Features

### 🤖 Universal Reputation System
- **One address, one reputation** — works for humans and AI agents
- **Cross-platform trust** — any dApp can query reputation scores
- **Portable identity** — reputation follows you across ecosystems

### 🔍 AI Trust Scoring
- **0–1000 score** based on on-chain activity analysis
- Multi-dimensional analysis: wallet age, transaction patterns, counterparty quality
- Includes **confidence percentage** and **risk assessment**

### 📜 Credential Verification
- Upload documents (KYC, attestations, certificates)
- Hash stored on 0G Storage with Merkle proof
- Anyone can verify: `download → rehash → compare`

### 🔐 Fully Auditable Pipeline
```
Wallet Activity → 0G Compute (AI) → 0G Storage (Report) → 0G Chain (Anchor)
```

---

## 🏗️ Architecture

### Tech Stack
- **Smart Contracts**: Solidity on 0G Chain (Galileo Testnet - Chain ID: 16601)
- **Frontend**: React 19, TanStack Start (SSR), TailwindCSS, Framer Motion
- **Web3**: wagmi, viem, RainbowKit
- **Storage**: 0G Storage SDK with Merkle proof verification
- **Compute**: 0G Compute Network (decentralized AI inference)
- **Backend**: Node.js, TypeScript, ethers.js

### Project Structure
```
credlayer/
├── contracts/              # Smart contracts (0G Chain)
│   └── CredLayerTrust.sol  # Core trust registry contract
├── frontend/               # React frontend application
├── scripts/                # Deployment & utility scripts
├── test/                   # Smart contract tests
├── docs/                   # Documentation
└── .env                    # Environment configuration
```

### Smart Contracts
```solidity
CredLayerTrust.sol          // Core contract combining:
  - Identity Registry       // DID anchoring and profiles
  - Reputation Registry     // Trust scores with metadata
  - Credential Registry     // Document hash verification

  ✅ Transaction sent to mempool!
🔗 Hash: 0x59beb93be52e6b2c1cb6ac28fbc3be797ccec0d9a844cb53c0462e5f3b55f7b8
⏳ Waiting for block confirmation (Do not close)...
🎉 SUCCESS! The node accepted and mined it.

🚀 DEPLOYMENT 100% SUCCESSFUL!
--------------------------------------------------
📜 Contract Address: 0x21D7912FF655a28B185d183b5c7F2DD310ac410D
🌐 Network: 0G Galileo Testnet
--------------------------------------------------
```

**Deployed on**: 0G Chain Galileo Testnet  
**Chain ID**: 16601  
**Explorer**: [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- MetaMask or compatible Web3 wallet
- 0G Galileo testnet tokens ([Get from faucet](https://faucet.0g.ai/))

### Installation

```bash
# Clone the repository
git clone https://github.com/thebuildercore/credlayer.git
cd credlayer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Setup

Create a `.env` file with the following:

```env
# Blockchain
PRIVATE_KEY="your_private_key_here"
RPC_URL="https://evmrpc-testnet.0g.ai"

# 0G Compute
PROVIDER_ADDRESS="0xa48f01287233509FD694a22Bf840225062E67836"

# 0G Storage
STORAGE_RPC_URL="https://rpc-storage-testnet.0g.ai"
```

### 0G Compute Setup

Set up your 0G Compute account to enable AI inference:

```bash
# 1. Setup network and login
npx 0g-compute-cli setup-network
npx 0g-compute-cli login

# 2. Deposit testnet tokens (get from https://faucet.0g.ai/)
npx 0g-compute-cli deposit --amount 3

# 3. List available AI providers
npx 0g-compute-cli inference list-providers
```

> **Note:** Copy a Provider Address from the output (e.g., for Qwen 2.5 7B model)

```bash
# 4. Set provider address (Windows CMD)
set PROVIDER=0xa48f01287233509FD694a22Bf840225062E67836

# Or for PowerShell:
$env:PROVIDER="0xa48f01287233509FD694a22Bf840225062E67836"

# 5. Lock tokens with the provider
npx 0g-compute-cli transfer-fund --provider %PROVIDER% --amount 1
npx 0g-compute-cli inference acknowledge-provider --provider %PROVIDER%
```

### Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to 0G Galileo testnet
npx hardhat ignition deploy ./ignition/modules/CredLayerTrust.ts --network galileo

# Run tests
npx hardhat test
```

### Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎬 How It Works

### 1️⃣ Identity Registration
Users or AI agents register their wallet address on-chain, creating a permanent identity record.

### 2️⃣ Trust Score Generation
1. Frontend calls backend API with wallet address
2. Backend triggers **0G Compute inference** with on-chain activity data
3. AI model analyzes patterns and returns signed trust score (0-1000)
4. Full analysis report uploaded to **0G Storage** → Merkle root returned
5. Trust score + storage root anchored on **CredLayerTrust contract**

### 3️⃣ Credential Anchoring
Users upload verifiable credentials (documents, attestations):
- Document hashed and uploaded to 0G Storage
- Hash and storage URI recorded on-chain
- Anyone can download and verify against on-chain hash

### 4️⃣ Verification & Discovery
- Any dApp queries `getFullTrustProfile(address)` from contract
- Trust score, confidence, risk level, and storage root returned
- Full AI report downloadable from 0G Storage using root hash
- Merkle proof verified byte-for-byte for authenticity

---

## 📊 Trust Scoring Model

Our AI-powered scoring evaluates:

- **Wallet Age** — How long the address has been active
- **Transaction Patterns** — Frequency, amounts, and consistency
- **Counterparty Quality** — Who the address interacts with
- **Sybil Detection** — Patterns indicating fake/duplicate accounts
- **Historical Behavior** — Long-term reliability indicators

**Score Range**: 0-1000
- **900-1000**: Excellent trust (low risk)
- **700-899**: Good trust (moderate risk)
- **500-699**: Fair trust (elevated risk)
- **0-499**: Poor trust (high risk)

---

## 🔗 Integration Example

### Query Trust Score from Your dApp

```typescript
import { ethers } from 'ethers';
import { CREDLAYER_CONTRACT_ADDRESS, CREDLAYER_ABI } from './constants';

const provider = new ethers.JsonRpcProvider('https://evmrpc-testnet.0g.ai');
const contract = new ethers.Contract(
  CREDLAYER_CONTRACT_ADDRESS,
  CREDLAYER_ABI,
  provider
);

// Get full trust profile
const profile = await contract.getFullTrustProfile(walletAddress);
console.log('Trust Score:', profile.trustScore);
console.log('Confidence:', profile.confidence + '%');
console.log('Risk Level:', profile.riskLevel);
console.log('Storage Root:', profile.storageRoot);
```

### Verify Credential

```typescript
// Check if a credential is valid
const documentHash = ethers.keccak256(documentBytes);
const isValid = await contract.verifyCredential(documentHash);

if (isValid) {
  console.log('Credential verified ✅');
}
```

---

## 🛠️ Development

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/CredLayerTrust.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Smart Contract Commands

```bash
# Compile contracts
npx hardhat compile

# Clean build artifacts
npx hardhat clean

# Run local node
npx hardhat node

# Deploy to specific network
npx hardhat ignition deploy ./ignition/modules/CredLayerTrust.ts --network <network-name>
```

---

## 🏆 Why CredLayer?

### ✅ Complete 0G Integration
We leverage the **entire 0G stack** in a real production workflow:
- 0G Chain for immutable state
- 0G Storage for verifiable data
- 0G Compute for decentralized AI

### ✅ Real-World Use Case
Trust and reputation are **critical infrastructure** for:
- Autonomous AI agents
- DeFi protocols
- NFT marketplaces
- DAOs and governance
- P2P marketplaces

### ✅ Production-Ready
- Full TypeScript implementation
- Comprehensive smart contract tests
- SSR-optimized frontend
- Professional UI/UX with accessibility
- Proper error handling and security

### ✅ Novel Crypto + AI Synergy
We don't just store data — we use **decentralized AI to generate verifiable insights** that live permanently on-chain.

---

## 🔮 Future Roadmap

- [ ] Multi-chain reputation aggregation (bridge to other EVMs)
- [ ] Agent-to-agent trust negotiation protocol
- [ ] Reputation staking (lock tokens to boost score)
- [ ] Privacy-preserving ZK proofs for selective disclosure
- [ ] DAO governance for scoring model parameters
- [ ] Reputation NFTs (tradeable trust positions)
- [ ] Integration with major Web3 wallets and dApps

---

## 📚 Resources

- **Live Demo**: [credlayer0g.vercel.app](https://credlayer0g.vercel.app)
- **0G Documentation**: [docs.0g.ai](https://docs.0g.ai)
- **0G Chain Explorer**: [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)
- **0G Faucet**: [faucet.0g.ai](https://faucet.0g.ai/)
- **Hardhat Documentation**: [hardhat.org](https://hardhat.org)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for the 0G Zero Cup Hackathon

---

## 🙏 Acknowledgments

- **0G Foundation** for the incredible infrastructure primitives
- **Hardhat** for the best Ethereum development environment
- **TanStack** for powerful React tooling
- **RainbowKit** for elegant wallet connections
- The entire **0G community** for support and inspiration

---

<div align="center">

### 🌟 Star this repo if you believe in decentralized trust! 🌟

**Built on 0G Chain · 0G Storage · 0G Compute**

[🚀 Try Live Demo](https://credlayer0g.vercel.app) • [📖 Read Docs](https://docs.0g.ai) • [🔗 View Contracts](https://chainscan-galileo.0g.ai)

</div>
