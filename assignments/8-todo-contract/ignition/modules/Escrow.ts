import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('EscrowModule', (m) => {
  const escrow = m.contract('Escrow');

  // m.call(counter, "incBy", [5n]);

  return { escrow };
});
