import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StakingModule", (m) => {
  const stakingToken = m.contract("StakingToken");
  const stakingRewards = m.contract("StakingRewards", [stakingToken]);

  return { stakingToken, stakingRewards };
});
