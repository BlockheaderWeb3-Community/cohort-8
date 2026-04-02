import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TimeVaultModule", (m) => {
  const timeVault = m.contract("TimeVault");

  // m.call(counter, "incBy", [5n]);

  return { timeVault };
});
