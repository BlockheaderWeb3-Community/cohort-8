import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy StakingToken
  const stakingToken = await ethers.deployContract("StakingToken");
  await stakingToken.waitForDeployment();
  console.log("StakingToken deployed to:", await stakingToken.getAddress());

  // Deploy StakingRewards
  const stakingRewards = await ethers.deployContract("StakingRewards", [
    await stakingToken.getAddress(),
  ]);
  await stakingRewards.waitForDeployment();
  console.log("StakingRewards deployed to:", await stakingRewards.getAddress());

  // Fund the staking contract with reward tokens
  const rewardAmount = ethers.parseEther("10000");
  await stakingToken.transfer(await stakingRewards.getAddress(), rewardAmount);
  console.log("Funded StakingRewards with", ethers.formatEther(rewardAmount), "tokens");

  // Transfer some tokens to user1
  const userAmount = ethers.parseEther("1000");
  await stakingToken.transfer(user1.address, userAmount);
  console.log("Transferred", ethers.formatEther(userAmount), "tokens to user1");

  // User1 stakes tokens
  const stakeAmount = ethers.parseEther("100");
  await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), stakeAmount);
  await stakingRewards.connect(user1).stake(stakeAmount);
  console.log("User1 staked", ethers.formatEther(stakeAmount), "tokens");

  // Wait some time
  console.log("\nWaiting 60 seconds for rewards to accrue...");
  await ethers.provider.send("evm_increaseTime", [60]);
  await ethers.provider.send("evm_mine", []);

  // Check earned rewards
  const earned = await stakingRewards.earned(user1.address);
  console.log("User1 earned:", ethers.formatEther(earned), "tokens");

  // Claim rewards
  await stakingRewards.connect(user1).claimRewards();
  const balance = await stakingToken.balanceOf(user1.address);
  console.log("User1 balance after claiming:", ethers.formatEther(balance), "tokens");

  // Check stake info
  const stake = await stakingRewards.stakes(user1.address);
  console.log("\nUser1 stake info:");
  console.log("  Amount:", ethers.formatEther(stake.amount), "tokens");
  console.log("  Reward Debt:", ethers.formatEther(stake.rewardDebt), "tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
