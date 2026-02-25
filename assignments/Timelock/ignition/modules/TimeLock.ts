import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TimeLockModule", (m) => {
  const timelock = m.contract("TimeLock");
  return { timelock };
});
