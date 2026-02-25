import { ethers } from "ethers";

async function main() {
  // 1. Connect directly to the Sepolia RPC
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  
  // 2. Connect your wallet using the private key from your config comments
  const privateKey = "7e318ba7f9c52530342d2ae81ccb02da9156d4c49121d541ac8de41d0d6ce619";
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`Wallet connected: ${wallet.address}`);

  // 3. Connect to your deployed contract
  const contractAddress = "0xe4f44FCB12bfe1996163106177c44FA64560A9Ff";
  
  // We only need the ABI for the mint function to interact with it
  const abi = [
    "function mint(address to, uint256 tokenId) external"
  ];
  const erc721 = new ethers.Contract(contractAddress, abi, wallet);

  // 4. Execute the mint transaction!
  console.log("Sending mint transaction for Token #1...");
  const tx = await erc721.mint(wallet.address, 1);
  
  console.log(`Transaction sent! Hash: ${tx.hash}`);
  console.log("Waiting for block confirmation...");
  
  await tx.wait();
  console.log("✅ Minted Token 1 successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});