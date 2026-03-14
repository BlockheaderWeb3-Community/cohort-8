# Escrow V2 - Milestone Payment Contract

A client hires a freelancer and pays per milestone instead of all at once.

## Roles
- Client
- Freelancer

## Workflow
1. Client deploys the contract and funds it upfront.
2. Freelancer marks a milestone as completed.
3. Client approves the milestone.
4. Contract releases ETH per milestone.
5. After all milestones are approved, the job is complete.

## Contract Summary
- Single job per contract instance.
- Funds are locked at deployment.
- Milestones are tracked and cannot be double-paid.

## Thought Questions
- **What happens if the client disappears?**
  The freelancer cannot get paid without client approval. A common extension is a timeout that lets the freelancer claim payment after a deadline.
- **Should the freelancer be able to cancel?**
  That depends on the agreement. You could add mutual cancellation or a client-only cancellation with a refund for unapproved milestones.
- **How do you prevent double payments?**
  Each milestone has a status (Pending → Completed → Approved). The contract only pays on the Approved transition and rejects repeat approvals.

## Local Commands
```bash
npm test
npm run compile
```

## Notes
The test and compile scripts use local `.hardhat/` paths so the project is self-contained when moved to another machine.
