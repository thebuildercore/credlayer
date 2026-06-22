/**
 * Verification script to ensure frontend can read on-chain data
 * Run with: npx tsx verify-onchain.ts
 */
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_REPUTATION || process.env.NEXT_PUBLIC_CONTRACT_REPUTATION;
const RPC_URL = process.env.VITE_0G_RPC_URL || process.env.NEXT_PUBLIC_0G_RPC_URL || 'https://evmrpc-testnet.0g.ai';
const CHAIN_ID = process.env.VITE_CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || '16602';

const ABI = [
  "function owner() view returns (address)",
  "function getFullTrustProfile(address _subject) view returns (string entityType, uint16 trustScore, uint8 confidence, string riskLevel, string storageRoot, uint256 lastUpdated)",
  "function hasReputation(address) view returns (bool)"
];

async function verifyOnChainConnection() {
  console.log('\n🔍 Verifying On-Chain Data Connection...\n');
  
  console.log('📋 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Chain ID:', CHAIN_ID);
  console.log('  Contract:', CONTRACT_ADDRESS || '❌ NOT SET');
  
  if (!CONTRACT_ADDRESS) {
    console.error('\n❌ ERROR: Contract address not configured!');
    console.error('   Please set VITE_CONTRACT_REPUTATION in .env file\n');
    process.exit(1);
  }
  
  try {
    // Connect to the network
    console.log('\n🌐 Connecting to 0G Galileo Testnet...');
    const provider = new ethers.JsonRpcProvider(RPC_URL, parseInt(CHAIN_ID));
    
    // Get network info
    const network = await provider.getNetwork();
    console.log('✅ Connected to chain ID:', network.chainId.toString());
    
    // Get latest block
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ Latest block:', blockNumber);
    
    // Connect to contract
    console.log('\n📜 Connecting to CredLayerTrust contract...');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    // Get contract owner
    const owner = await contract.owner();
    console.log('✅ Contract owner:', owner);
    
    // Test reading a profile (will fail if no reputation exists, but proves contract is accessible)
    console.log('\n🧪 Testing contract read functions...');
    try {
      const hasRep = await contract.hasReputation(owner);
      console.log('✅ hasReputation() works. Owner has reputation:', hasRep);
      
      if (hasRep) {
        const profile = await contract.getFullTrustProfile(owner);
        console.log('✅ getFullTrustProfile() works!');
        console.log('   Entity Type:', profile[0]);
        console.log('   Trust Score:', profile[1].toString());
        console.log('   Confidence:', profile[2].toString() + '%');
        console.log('   Risk Level:', profile[3]);
        console.log('   Storage Root:', profile[4]);
      }
    } catch (e: any) {
      if (e.message.includes('Subject profile does not exist')) {
        console.log('⚠️  No reputation data yet (expected for new deployments)');
      } else {
        throw e;
      }
    }
    
    console.log('\n✅ SUCCESS! Frontend can read on-chain data from the contract.');
    console.log('   The frontend will use this contract for all trust score queries.\n');
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error('   Please check your configuration and network connection.\n');
    process.exit(1);
  }
}

verifyOnChainConnection();
