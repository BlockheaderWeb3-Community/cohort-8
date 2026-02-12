import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionModule", (m) => {
  const Auction = m.contract("FactoryEscrow");



  return { Auction };
});
