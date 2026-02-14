import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ClientModule", (m) => {
  const escrow = m.contract("MilestoneEscrow");

  return { escrow };
});
