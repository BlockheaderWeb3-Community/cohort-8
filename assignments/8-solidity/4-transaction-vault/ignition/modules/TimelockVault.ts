import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { parseEther } from 'ethers';

export default buildModule('TimelockVaultModule', (m) => {
  const timelockVault = m.contract('TimelockVault', [600], {
    value: parseEther('0.1'),
  });

  return { timelockVault };
});
