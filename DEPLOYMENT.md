# 🚀 Deployment Information

## Contract Deployment

### CredLayerTrust Contract

**Network**: 0G Galileo Testnet  
**Chain ID**: 16602  
**Contract Address**: `0x21D7912FF655a28B185d183b5c7F2DD310ac410D`  
**Transaction Hash**: `0x59beb93be52e6b2c1cb6ac28fbc3be797ccec0d9a844cb53c0462e5f3b55f7b8`  
**Deployment Date**: 2025  

### Contract Details

This is a **unified contract** that combines three registries:
- Identity Registry
- Reputation Registry  
- Credential Registry

All frontend environment variables should point to the same contract address:
```env
NEXT_PUBLIC_CONTRACT_IDENTITY=0x21D7912FF655a28B185d183b5c7F2DD310ac410D
NEXT_PUBLIC_CONTRACT_REPUTATION=0x21D7912FF655a28B185d183b5c7F2DD310ac410D
NEXT_PUBLIC_CONTRACT_CREDENTIAL=0x21D7912FF655a28B185d183b5c7F2DD310ac410D
```

### View on Explorer

- **Contract**: [View on 0G Explorer](https://chainscan-galileo.0g.ai/address/0x21D7912FF655a28B185d183b5c7F2DD310ac410D)
- **Transaction**: [View on 0G Explorer](https://chainscan-galileo.0g.ai/tx/0x59beb93be52e6b2c1cb6ac28fbc3be797ccec0d9a844cb53c0462e5f3b55f7b8)

### Contract Functions

#### Identity Management
- `registerIdentity(address, string)` - Register a new identity
- `getIdentity(address)` - Get identity details
- `identities(address)` - View identity data

#### Reputation Management
- `anchorReputation(address, uint16, uint8, string, string)` - Anchor trust score
- `getFullTrustProfile(address)` - Get complete trust profile
- `reputationRegistry(address)` - View reputation data
- `hasReputation(address)` - Check if address has reputation

#### Credential Management
- `anchorCredential(bytes32, string)` - Anchor a credential
- `verifyCredential(bytes32)` - Verify credential validity
- `revokeCredential(bytes32)` - Revoke a credential
- `credentialRegistry(bytes32)` - View credential data

#### Owner Functions
- `owner()` - Get contract owner
- `transferOwnership(address)` - Transfer contract ownership

## Frontend Configuration

After deployment, the frontend `.env` file has been updated with the contract address.

To run the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Verification (Optional)

To verify the contract on the explorer:
```bash
npx hardhat verify --network galileo 0x21D7912FF655a28B185d183b5c7F2DD310ac410D
```

## Next Steps

1. ✅ Contract deployed successfully
2. ✅ Frontend environment configured
3. ⏭️ Start the frontend application
4. ⏭️ Test contract integration
5. ⏭️ Deploy frontend to production (Vercel)
