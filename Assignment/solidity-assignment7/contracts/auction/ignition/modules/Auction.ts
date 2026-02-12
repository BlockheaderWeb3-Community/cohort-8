import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionModule", (m) => {
  const startingPrice = m.getParameter("startingPrice", 1n);
  const auctionDuration = m.getParameter("auctionDuration", 3600n);

  const auction = m.contract("SimpleAuction", [startingPrice, auctionDuration]);

  return { auction };
});
