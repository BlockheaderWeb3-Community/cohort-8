import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MileStoneEscrowModule", (m) => {
  let address = '0x910e783EaCbdC2453827B443Bf125Bac4B76E5C2';
  let milestoneCount = BigInt(5);
  let amountPerMilestone = BigInt(2);
  const mileStoneEscrow = m.contract("MilestoneEscrow", [address, milestoneCount, amountPerMilestone], { value: BigInt(milestoneCount * amountPerMilestone) });

  return { mileStoneEscrow };
}); 
