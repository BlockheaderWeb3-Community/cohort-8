import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EscrowFactoryModule", (m) => {
  const escrowFactory = m.contract("EscrowFactory");

  return { escrowFactory };
});

