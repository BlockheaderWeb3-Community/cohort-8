import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NFTMarketplaceModule", (m) => {
  // This is your wallet address. It will act as the "treasury" to collect the 2.5% fees.
  const treasuryAddress = "0x32e431575062f115be156a19C13bA4aa29d44065"; 

  // Deploy the contract and pass the treasury address to the constructor
  const marketplace = m.contract("NFTmarketplace", [treasuryAddress]);

  return { marketplace };
});