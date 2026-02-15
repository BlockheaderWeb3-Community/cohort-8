import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionModule", (m) => {
  const auction = m.contract("AuctionContract");
  return { auction };
});
