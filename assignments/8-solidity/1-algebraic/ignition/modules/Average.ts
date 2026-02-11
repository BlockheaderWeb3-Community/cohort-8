import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('AverageModule', (m) => {
  const average = m.contract('Average', [5, 10]);

  return { average };
});
