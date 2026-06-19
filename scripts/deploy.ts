import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Initiating RAW Ethers deployment to 0G Galileo Testnet...");

  // FIX 1: Disable request batching so dRPC's free tier doesn't block us
  const provider = new ethers.JsonRpcProvider("https://0g-galileo-testnet.drpc.org", undefined, {
    staticNetwork: true,
    batchMaxCount: 1 // Forces exactly 1 request at a time
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  
  console.log("⏳ Loading Contract Artifact...");
  const artifactPath = "./artifacts/contracts/CredLayerTrust.sol/CredLayerTrust.json";
  const artifactFile = fs.readFileSync(artifactPath, "utf8");
  const artifact = JSON.parse(artifactFile);

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("🔥 Sending deployment with hardcoded gas to bypass RPC limits...");
  
  // FIX 2: Hardcode a massive gas tip so we don't have to query the node for fee data
  const contract = await factory.deploy({
      gasLimit: 5000000,
      maxFeePerGas: ethers.parseUnits("500", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("50", "gwei")
  });
  
  console.log(`✅ Transaction sent to mempool!`);
  console.log(`🔗 Transaction Hash: ${contract.deploymentTransaction()?.hash}`);

  console.log("⏳ Waiting for block confirmation... Do not close the terminal!");
  await contract.waitForDeployment();

  const targetAddress = await contract.getAddress();

  console.log("\n🚀 DEPLOYMENT 100% SUCCESSFUL!");
  console.log("--------------------------------------------------");
  console.log(`📜 Contract Address: ${targetAddress}`);
  console.log(`🌐 Network: 0G Galileo`);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});