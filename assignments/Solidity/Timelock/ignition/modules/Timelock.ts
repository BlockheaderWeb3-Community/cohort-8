import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TimelockModule", (m) => {
  const timelock = m.contract("TimelockedVault");



  return { timelock };
});
