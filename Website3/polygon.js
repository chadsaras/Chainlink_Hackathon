// Javascript
// Setup: npm install alchemy-sdk
const { Alchemy, Network } = require("alchemy-sdk");

const settings = {
  apiKey: "u9VLSvdo9SLwvI-qyVwPDCbZdLbSbFYL", // Can replace with your API Key from https://www.alchemy.com
  network: Network.MATIC_AMOY, // Can replace with MATIC_AMOY for testnet config
};

const alchemy = new Alchemy(settings);

async function main() {
  const latestBlock = await alchemy.core.getBlockNumber();
  console.log("The latest block number is", latestBlock);
}

main();
