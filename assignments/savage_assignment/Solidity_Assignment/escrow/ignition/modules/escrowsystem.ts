import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EscrowSystemModule", (m) => {
  const escrowSystem = m.contract("EscrowSystem");

  // m.call(counter, "incBy", [5n]);

  return { escrowSystem };
});
