import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EscrowModule", (m) => {
  const escrow = m.contract("Escrow", ["0x4E1B1d9Af926e7e0FBCb9C5b23EEda9d80642b99", "0x910e783EaCbdC2453827B443Bf125Bac4B76E5C2", BigInt(100), 7200]);


  return { escrow };
});
