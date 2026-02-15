import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionContractModule", (m) => {
  const counter = m.contract("AuctionContract");

  // m.call(counter, "incBy", [5n]);

  return { counter };
});
