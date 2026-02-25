const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy Tokens
  const Token = await hre.ethers.getContractFactory("LNRToken");
  
  const lnr = await Token.deploy(hre.ethers.parseEther("1000000"));
  await lnr.waitForDeployment();
  console.log("LNR deployed to:", await lnr.getAddress());

  const stk = await Token.deploy(hre.ethers.parseEther("1000000"));
  await stk.waitForDeployment();
  console.log("STK deployed to:", await stk.getAddress());

  const rwd = await Token.deploy(hre.ethers.parseEther("1000000"));
  await rwd.waitForDeployment();
  console.log("RWD deployed to:", await rwd.getAddress());

  // Deploy Staking Protocol
  const Staking = await hre.ethers.getContractFactory("StakingProtocol");
  const staking = await Staking.deploy();
  await staking.waitForDeployment();
  console.log("Staking Protocol deployed to:", await staking.getAddress());

  // Create Pools
  console.log("\nCreating staking pools...");
  
  // Pool 0: Stake LNR, Earn RWD
  await (await staking.createPool(
    await lnr.getAddress(),
    await rwd.getAddress(),
    hre.ethers.parseEther("0.0001"), // 0.0001 RWD per second per token
    7 * 24 * 60 * 60, // 7 days lock
    10 // 10% penalty
  )).wait();
  console.log("Pool 0 created: Stake LNR -> Earn RWD");

  // Pool 1: Stake STK, Earn RWD
  await (await staking.createPool(
    await stk.getAddress(),
    await rwd.getAddress(),
    hre.ethers.parseEther("0.0002"), // Higher rate
    14 * 24 * 60 * 60, // 14 days lock
    20 // 20% penalty
  )).wait();
  console.log("Pool 1 created: Stake STK -> Earn RWD");

  // Pool 2: Stake LNR, Earn STK
  await (await staking.createPool(
    await lnr.getAddress(),
    await stk.getAddress(),
    hre.ethers.parseEther("0.00005"), // Lower rate
    3 * 24 * 60 * 60, // 3 days lock
    5 // 5% penalty
  )).wait();
  console.log("Pool 2 created: Stake LNR -> Earn STK");

  // Fund pools
  console.log("\nFunding pools with rewards...");
  
  await (await rwd.approve(await staking.getAddress(), hre.ethers.parseEther("100000"))).wait();
  await (await staking.fundPool(0, hre.ethers.parseEther("50000"))).wait();
  await (await staking.fundPool(1, hre.ethers.parseEther("50000"))).wait();
  
  await (await stk.approve(await staking.getAddress(), hre.ethers.parseEther("50000"))).wait();
  await (await staking.fundPool(2, hre.ethers.parseEther("50000"))).wait();
  
  console.log("Pools funded successfully!");

  // Save addresses for frontend use
  const addresses = {
    LNR: await lnr.getAddress(),
    STK: await stk.getAddress(),
    RWD: await rwd.getAddress(),
    StakingProtocol: await staking.getAddress()
  };
  
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});v