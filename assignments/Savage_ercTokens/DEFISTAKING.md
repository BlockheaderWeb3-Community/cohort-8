# DeFi Staking & Rewards Protocol — Full System Explanation

## The Full System — 4 Contracts Working Together

Think of this whole system as a **bank with a receipt desk**.

The bank is the DefiStaking contract. The receipt desk is the ReceiptToken. The currencies are your 3 tokens. Every piece has a role.

---

## RecieptERC20 — The Receipt Desk

Before we even get to the main contract, understand this one because everything depends on it.

### State Variables

- `owner` — the wallet that deployed the receipt token. Has admin power over it. Set in the constructor as `msg.sender`.
- `pool` — the DefiStaking contract's address. This is not a person, it's a contract. It's the only address allowed to mint and burn receipt tokens. It starts empty and gets set after DefiStaking is deployed.

### The Two Modifiers

- `onlyOwner` — checks `msg.sender == owner`. Protects `setPool` so only the deployer can link the DefiStaking contract.
- `onlyPool` — checks `msg.sender == pool`. This is the security guard. It protects `mint` and `burn` so that only the DefiStaking contract can create or destroy receipt tokens. Random wallets cannot call these functions.

### Functions

**`setPool(address _pool)`** — the linking function. After you deploy DefiStaking, you call this with DefiStaking's address. This is what connects both contracts together. Only owner can call it.

**`mint(address account, uint256 amount)`** — protected by `onlyPool`. When DefiStaking calls this during staking, it mints receipt tokens directly to the user's address. It passes the user's address down to `_mint` which does the actual work.

**`burn(address account, uint256 amount)`** — protected by `onlyPool`. When DefiStaking calls this during withdrawal, it burns the user's receipt tokens. It passes the user's address down to `_burn`. The `emit` inside `_burn` uses `account` not `msg.sender` because `account` is whose tokens are actually being destroyed.

### Why Receipt Tokens Exist

They are **proof of stake**. You cannot withdraw from DefiStaking without the contract burning your receipt tokens. You cannot fake a stake because only the pool can mint them. They make the whole system trustless.

---

## DefiStaking — The Bank Vault With a Reward System

### Interfaces

The interfaces at the top are the contract's way of knowing how to talk to your 3 token contracts. Without them, Solidity doesn't know what functions exist on those external addresses and won't let you call them.

- `IERC20` covers stakeToken and rewardToken — it exposes `transfer`, `transferFrom`, `balanceOf`, and `approve`.
- `IReceiptToken` covers the receipt token separately because it needs `mint` and `burn` which aren't standard ERC20 functions.

### State Variables

- `stakeToken`, `rewardToken`, `receiptToken` — references to your 3 deployed tokens, cast to their interface types so the contract can call functions on them.
- `rewardRate` — the tap controlling reward flow. How many reward tokens accumulate per second per token staked. Set at deployment, adjustable by owner.
- `totalStaked` — the running total of all tokens currently sitting in the pool across every user.
- `owner` — the deployer's wallet. Has power to update reward rate and receive penalties.

### Mappings

- `stakedBalance` — how much each wallet has deposited into the pool.
- `rewardBalance` — rewards that have been calculated and saved but not yet claimed. Think of it as the user's reward savings account inside the contract.
- `lastUpdateTime` — the timestamp of the last time that user's rewards were calculated. This is the starting point for the next reward calculation.

### Constructor

The setup moment. You pass in the 3 deployed token addresses and a reward rate. The contract casts each address to its interface type and stores them. Sets `owner = msg.sender`. After this, you go to the receipt token and call `setPool` with this contract's address.

### Functions

**`calculateReward(address user)`** — the math engine. It's `internal` and `view` — it never changes state, only reads and returns. It answers one question: _"how much has this user earned since the last update?"_

The formula:

```solidity
rewards = stakedBalance[user] * rewardRate * timeElapsed / 1e18
```

If the user has nothing staked it returns 0 immediately. The `1e18` division is there because rewardRate is set in wei scale to allow precise decimal rewards.

---

**`updateReward(address user)` modifier** — the checkpoint that must fire before any function that touches balances. It calls `calculateReward`, adds the result to `rewardBalance[user]` to save it, then resets `lastUpdateTime[user]` to now.

This snapshots rewards at the current moment before any balance changes happen. If you didn't do this, changing the staked balance first would corrupt the reward calculation.

---

**`stake(uint256 amount)`** — user deposits tokens.

Flow:

1. Modifier snapshots rewards first
2. Check amount > 0
3. Pull stakeTokens from user into contract via `transferFrom` (works because user approved the contract)
4. Update `stakedBalance` and `totalStaked`
5. Mint receipt tokens to user as proof
6. Emit event

---

**`withdraw(uint256 amount)`** — user takes tokens back.

Flow:

1. Modifier snapshots rewards first
2. Check amount > 0 AND they have enough staked
3. Update balances first (Checks-Effects-Interactions pattern)
4. Burn receipt tokens (proof destroyed, can't withdraw again without re-staking)
5. Transfer stakeTokens back to user
6. Emit event

---

**`claimRewards()`** — user collects earned rewards.

Flow:

1. Modifier snapshots latest rewards into `rewardBalance` first
2. Read that balance into a local variable
3. Check it's > 0
4. Reset `rewardBalance[msg.sender]` to 0 BEFORE transferring (security)
5. Transfer rewardTokens to user
6. Emit event

---

**`emergencyWithdraw()`** — the panic button. No reward calculation.

Flow:

1. Read full staked balance
2. Require it's > 0
3. Calculate 10% penalty
4. Zero out ALL their balances first
5. Burn receipt tokens
6. Send 90% back to user
7. Send 10% penalty to owner
8. Emit event

> No `updateReward` modifier here intentionally — emergency means they forfeit rewards.

---

**`updateRewardRate(uint256 newRate)`** — `onlyOwner`. The owner's control lever. Real DeFi protocols don't lock reward rates forever. Market conditions change, token prices change. The owner needs to attract more stakers or protect the reward supply. This function gives them that power.

---

**`getStakedBalance(address user)`** — view function. Returns how much a user has staked. No state changes.

**`getPendingReward(address user)`** — view function. Returns `rewardBalance[user] + calculateReward(user)`. Both combined because `rewardBalance` holds already snapshotted rewards and `calculateReward` returns what's been accumulating since the last snapshot.

---

## The Deployment Order

1. Deploy `SavyXERC20` (stake token)
2. Deploy `RewardERC20` (reward token)
3. Deploy `RecieptERC20` (receipt token)
4. Deploy `DefiStaking` passing all 3 addresses + rewardRate
5. Call `setPool` on `RecieptERC20` with DefiStaking's address
6. Make sure DefiStaking holds enough rewardTokens to pay out rewards

> **Important** — your DefiStaking contract needs a supply of reward tokens to transfer to users when they claim. Either mint them to the contract or transfer them there after deployment.

---

## Security Patterns Used

- **Checks-Effects-Interactions** — state variables are always updated before external token transfers. This protects against reentrancy attacks.
- **onlyPool modifier** — only the DefiStaking contract can mint or burn receipt tokens.
- **onlyOwner modifier** — only the deployer can perform admin actions.
- **updateReward modifier** — rewards are always snapshotted before balances change, keeping the math honest.
