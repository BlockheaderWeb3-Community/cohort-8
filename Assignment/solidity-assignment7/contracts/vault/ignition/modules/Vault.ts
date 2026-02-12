import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VaultModule", (m) => {
  const vault = m.contract("TimelockedSavingsVault");

  return { vault };
});
