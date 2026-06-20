require('dotenv').config({ path: '.env.local' });
const { ethers } = require('ethers');

const originalFetch = globalThis.fetch;
globalThis.fetch = function(url, options) {
  if (url === 'https://evmrpc-testnet.0g.ai' || url === 'https://evmrpc-testnet.0g.ai/') {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Host'] = 'evmrpc-testnet.0g.ai';
    return originalFetch('https://35.197.33.167/', options);
  }
  return originalFetch(url, options);
};

async function main() {
  const brokerMod = await import('@0glabs/0g-serving-broker');
  const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai", 16601, { staticNetwork: true });
  const pk = process.env.ZG_COMPUTE_PRIVATE_KEY.startsWith('0x') ? process.env.ZG_COMPUTE_PRIVATE_KEY : '0x' + process.env.ZG_COMPUTE_PRIVATE_KEY;
  const signer = new ethers.Wallet(pk, provider);
  const createBroker = brokerMod.createZGComputeNetworkBroker ?? brokerMod.createBroker;
  const client = await createBroker(signer);
  
  console.log("Adding 10 0G account balance...");
  // The SDK might have client.addAccount() directly or client.ledger.addAccount()
  try {
    if (client.addAccount) {
      const tx = await client.addAccount(10);
      console.log("Tx:", tx?.hash ?? tx);
    } else if (client.account && client.account.addAccount) {
      const tx = await client.account.addAccount(10);
      console.log("Tx:", tx?.hash ?? tx);
    } else {
      console.log("Structure:", Object.keys(client));
    }
  } catch (e) { console.error("Add account err:", e.message); }
  
  console.log("Transferring 5 0G to provider...");
  try {
    if (client.transferFund) {
      const tx2 = await client.transferFund("0xa48f01287233509FD694a22Bf840225062E67836", "chatbot", 5);
      console.log("Tx:", tx2?.hash ?? tx2);
    } else {
      console.log("Structure:", Object.keys(client));
    }
  } catch (e) { console.error("Transfer err:", e.message); }
}
main().catch(console.error);
