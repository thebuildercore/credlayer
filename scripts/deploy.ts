import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Initiating BULLETPROOF Ethers deployment to 0G Galileo...");

  // Array of every known public 0G Galileo RPC
  const rpcs = [
    "https://16602.rpc.thirdweb.com",      // ThirdWeb (Usually the most reliable)
    "https://evmrpc-testnet.0g.ai",        // Official Node 1
    "https://rpc-testnet.0g.ai",           // Official Node 2
    "https://0g-galileo-testnet.drpc.org"  // dRPC (Currently unstable)
  ];

  const artifactPath = "./artifacts/contracts/CredLayerTrust.sol/CredLayerTrust.json";
  const artifactFile = fs.readFileSync(artifactPath, "utf8");
  const artifact = JSON.parse(artifactFile);

  let targetAddress = null;

  console.log("⏳ Commencing RPC gauntlet...");

  for (const url of rpcs) {
    console.log(`\n========================================`);
    console.log(`📡 Attempting deployment via: ${url}`);
    
    try {
      // 1. Connect (batchMaxCount: 1 bypasses free-tier restrictions)
      const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true, batchMaxCount: 1 });
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
      
      // 2. Prepare Factory
      const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

      // 3. Fire Transaction with aggressive gas to skip network estimation bugs
      console.log("🔥 Sending transaction...");
      const contract = await factory.deploy({
          gasLimit: 5000000,
          maxFeePerGas: ethers.parseUnits("50", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("5", "gwei")
      });
      
      console.log(`✅ Transaction sent to mempool!`);
      console.log(`🔗 Hash: ${contract.deploymentTransaction()?.hash}`);
      console.log("⏳ Waiting for block confirmation (Do not close)...");
      
      // 4. Wait for it to be mined
      await contract.waitForDeployment();
      targetAddress = await contract.getAddress();
      
      console.log(`🎉 SUCCESS! The node accepted and mined it.`);
      break; // Exit the loop! We don't need the other RPCs anymore.

    } catch (error: any) {
      // If the RPC crashes, rate-limits, or throws a 500 error, we catch it here.
      console.log(`❌ Failed using ${url}`);
      console.log(`   Reason: ${error.shortMessage || error.message.split('\n')[0]}`);
      console.log(`   Moving to the next RPC in the list...`);
    }
  }

  // Final Results
  if (targetAddress) {
    console.log("\n🚀 DEPLOYMENT 100% SUCCESSFUL!");
    console.log("--------------------------------------------------");
    console.log(`📜 Contract Address: ${targetAddress}`);
    console.log(`🌐 Network: 0G Galileo Testnet`);
    console.log("--------------------------------------------------");
  } else {
    console.error("\n🚨 FATAL ERROR: Exhausted all available RPC nodes. The entire 0G Testnet might be halted or down for maintenance right now.");
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("❌ Unhandled Script Error:", error);
  process.exitCode = 1;
});