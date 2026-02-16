# Simple Crowdfunding Contract

A smart contract where users pledge ETH to fund a project goal within a specific deadline.



## Features
- **Goal System**: Owner sets a target ETH amount and a time limit (duration).
- **Contribute**: Users send ETH to the contract before the deadline.
- **Success**: If `totalRaised >= goal`, the Owner can withdraw the funds.
- **Refunds**: If the deadline passes and `totalRaised < goal`, contributors can claim a full refund.
- **Security**: Implements Checks-Effects-Interactions pattern to prevent re-entrancy during refunds.

## Workflow
1. Deploy with `_goal` and `_duration`.
2. Users call `contribute()` with ETH.
3. If Goal Met: Owner calls `withdraw()`.
4. If Deadline Passed & Goal Missed: Users call `refund()`.