import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterModule", (m) => {
  const crowdfund = m.contract("Crowdfunding", );

  // m.call(counter, "incBy", [5n]);

  return { crowdfund };
});
