import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StakingModule", (m) => {
  // Deploy staking token (the token users will stake)
  const stakingToken = m.contract("ERC20", ["Staking Token", "STK", 18, 1000000000000000000000000n], { id: "StakingToken" });
  
  // Deploy reward token (the token users will earn as rewards)
  const rewardToken = m.contract("ERC20", ["Reward Token", "RWD", 18, 1000000000000000000000000n], { id: "RewardToken" });
  
  // Deploy the StakingFactory
  const stakingFactory = m.contract("StakingFactory", []);
  
  return { stakingToken, rewardToken, stakingFactory };
});
