import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CrowdfundModule", (m) => {
  const goal = m.getParameter("goal", 10n);
  const deadline = m.getParameter("deadline", 2000000000n);

  const crowdfunding = m.contract("SimpleCrowdfunding", [goal, deadline]);

  return { crowdfunding };
});
