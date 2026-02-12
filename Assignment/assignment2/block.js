import { ethers } from "ethers";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// 1. Connect to Ethereum mainnet using secure API URL from .env
const apiUrl = process.env.ALCHEMY_API_URL;
if (!apiUrl) {
  throw new Error("ALCHEMY_API_URL not found in .env file");
}

const provider = new ethers.JsonRpcProvider(apiUrl);

async function fetchBlock(blockNumber) {
  // 2. Fetch real block data
  const block = await provider.getBlock(blockNumber);

  // 3. Display key block header fields
  const date = new Date(block.timestamp * 1000);
  console.log("Block Number:", block.number);
  console.log("Parent Hash:", block.parentHash);
  console.log("Timestamp:", date.toUTCString());
  console.log("Gas Used:", block.gasUsed.toString());
  console.log("Gas Limit:", block.gasLimit.toString());
  console.log("Base Fee Per Gas:", block.baseFeePerGas.toString()/1e20, "Eth");
  console.log("Receipts Root:", block.receiptsRoot);
  console.log("State Root:", block.stateRoot);
  console.log("Validator:", block.miner);
   console.log("Logs Bloom:", block.logsBloom);

   console.log("Block Hash:", block.hash);
}

fetchBlock("latest");
