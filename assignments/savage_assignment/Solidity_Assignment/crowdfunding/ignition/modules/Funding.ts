import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CrowdFundingModule", (m) => {
  const crowdFunding = m.contract("CrowdFunding");

  // m.call(counter, "incBy", [5n]);

  return { crowdFunding };
});
