import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Escrow2Module", (m) => {
  const e = m.contract("AuctionContract");


  return {e};
});
