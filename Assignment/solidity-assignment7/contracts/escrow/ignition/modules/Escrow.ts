import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EscrowFactoryModule", (m) => {
  const factory = m.contract("MultiEscrowFactory");

  return { factory };
});
