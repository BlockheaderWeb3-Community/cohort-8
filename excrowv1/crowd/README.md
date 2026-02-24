CrowdFunding Smart Contract

A simple crowdfunding smart contract written in Solidity (^0.8.28).

Users can create campaigns, contribute ETH, request refunds if the goal is not met, and creators can withdraw funds if the campaign succeeds.

How It Works
1️⃣ Create Campaign

Anyone can create a campaign by providing:

Title

Funding goal (in wei)

Duration (in seconds)

The campaign becomes ACTIVE immediately.

2️⃣ Contribute

Users send ETH to a campaign using contribute().

Must send ETH

Campaign must still be active

Cannot contribute after deadline

If user sends more than needed, extra ETH is refunded automatically

If goal is reached → campaign becomes SUCCESSFUL

3️⃣ Refund

If:

Deadline has passed

Goal was NOT reached

Contributors can call requestRefund() to get their money back.

Campaign becomes UNSUCCEEDED.

4️⃣ Withdraw (Creator Only)

If campaign is SUCCESSFUL,
the campaign creator can call withdraw() to collect the funds.

Funds can only be withdrawn once.

Campaign Status

ACTIVE

SUCCESSFUL

UNSUCCEEDED

DELETED

Security

Uses nonReentrant modifier to prevent reentrancy attacks

Uses safe call for ETH transfers

Prevents double withdrawals

Main Functions

createCampaign()

contribute()

requestRefund()

withdraw()

Use Cases

Fundraising

Charity campaigns

Startup funding

Community projects