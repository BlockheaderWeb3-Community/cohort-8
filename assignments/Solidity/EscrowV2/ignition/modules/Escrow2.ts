import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default  buildModule("Escrow2Module",  (m) => {

  let addr = "0xD1C612E5Eac67dBcA15F9ACB721c21Fff22600B3";
  let totalMilestones = 3;
  let totalAmount = 1;
  const a = m.contract("MilestoneEscrow", [addr, totalMilestones, totalAmount], {value: BigInt(1000000000)}); // One eth

//bigInt - 1^9 - 1^18 - 1Eth

  return { a };
});
