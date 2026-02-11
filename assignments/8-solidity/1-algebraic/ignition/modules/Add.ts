import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AddModule", (m) => {
  const add = m.contract("Add", [5, 10]);

  return { add };
});
