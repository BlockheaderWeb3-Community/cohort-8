import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MileStoneModule", (m) => {
  const mileStone = m.contract("MileStonePayment");

  // m.call(counter, "incBy", [5n]);

  return { mileStone };
});
