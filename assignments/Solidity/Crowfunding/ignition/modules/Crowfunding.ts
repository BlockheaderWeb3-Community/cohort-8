import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CrowdfundingModule", (m) => {
  let targetAmount = 3;
  let durationSeconds = 600;

  const t = m.contract("Crowdfunding",[targetAmount, durationSeconds], {value: BigInt(1000000000)});



  return { t };
});
