import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Hardhat v3 explicitly requires this type declaration for local networks
      type: "edr-simulated",
      chainType: "l1"
    },
    galileo: {
      // Hardhat v3 explicitly requires this type declaration for remote RPCs
      type: "http",
      chainType: "l1",
      url: "https://evmrpc-testnet.0g.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});