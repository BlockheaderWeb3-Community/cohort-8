import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MilestoneModule", (m) => {
  const milestone = m.contract("Milestone");

  // m.call(counter, "incBy", [5n]);

  return { milestone };
});
