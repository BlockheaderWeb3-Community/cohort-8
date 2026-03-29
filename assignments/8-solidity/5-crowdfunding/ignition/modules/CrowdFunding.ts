import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('CrowdFundingModule', (m) => {
  const fundingGoal = 1_000_000_000_000_000_000n; // 1 ETH (in wei)
  const duration = 60n * 60n * 24n * 7n; // 7 days in seconds

  const crowdFunding = m.contract('CrowdFunding', [fundingGoal, duration]);

  return { crowdFunding };
});
