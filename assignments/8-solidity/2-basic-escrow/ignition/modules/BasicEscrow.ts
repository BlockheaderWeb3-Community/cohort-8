import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('BasicEscrowModule', (m) => {
  const client = m.getParameter('client');
  const freelancer = m.getParameter('freelancer');
  const totalMilestones = m.getParameter<bigint>('totalMilestones');
  const milestoneAmount = m.getParameter<bigint>('milestoneAmount');
  const approvalTimeout = m.getParameter<bigint>('approvalTimeout');
  const totalValue = m.getParameter<bigint>('totalValue');

  const escrow = m.contract(
    'BasicEscrow',
    [client, freelancer, totalMilestones, milestoneAmount, approvalTimeout],
    {
      value: totalValue,
    }
  );

  return { escrow };
});
