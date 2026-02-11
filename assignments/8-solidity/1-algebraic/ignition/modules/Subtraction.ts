import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('SubtractionFactoryModule', (m) => {
  const factory = m.contract('SubtractionFactory');

  return { factory };
});
