MilestoneV2

A simple milestone payment smart contract written in Solidity (^0.8.28).

It allows a client to lock ETH and pay a freelancer step by step.

How It Works
1️⃣ Client Creates Job

Sends full ETH upfront

Sets:

ETH per milestone

Number of milestones

Total ETH must equal:

ethPerMilestone × totalMilestones

2️⃣ Freelancer Takes Job

takeJob()
A freelancer is assigned to the job.

3️⃣ Submit Work

submitMilestone()
Freelancer submits the current milestone.

4️⃣ Approve Work

approveMilestone()
Client approves and payment is released.

5️⃣ Auto Approve

If client does not approve within 3 days,
freelancer can call autoApproveMilestone() to get paid.

Simple Flow

Client funds → Freelancer submits → Client approves → Freelancer gets paid 💰

Repeats until all milestones are completed.