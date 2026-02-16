# Milestone Escrow (v2)

A smart contract system where clients pay freelancers per milestone.

## Workflow
1. **Factory**: `MilestoneJobFactory` creates a unique contract for the job.
2. **Deposit**: Client deposits the *full* amount for all milestones upfront (`depositFunds`).
3. **Work & Pay**: 
   - Freelancer completes work.
   - Client calls `approveMilestone`.
   - Contract releases `ethPerMilestone` to Freelancer.
4. **Completion**: Job status becomes `COMPLETED` when all milestones are paid.
5. **Safety**: Freelancer can `cancelJob` to refund the Client if they cannot complete the work.