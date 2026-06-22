# Overview

This project demonstrates a classic **Reentrancy Vulnerability** in Solidity. It includes an exploit contract and a secured version of the contract that implements industry-standard fixes.

---

## Project Structure

* **src/VulnerableContract.sol**: The original contract with the reentrancy bug.
* **src/Attacker.sol**: Malicious contract used to drain funds.
* **src/FixedContract.sol**: The secured version using CEI and a Reentrancy Guard.
* **test/VulnerableContract.t.sol**: Foundry tests that prove the exploit and the fix.

---

## Getting Started

### Prerequisites

Make sure you have [Foundry](https://book.getfoundry.sh/getting-started/installation) installed on your machine.

### Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/rayeberechi/buidl-test.git
    cd buidl-test
    ````

2. **Install dependencies:**

   ```bash
   forge install
   ```

3. **Compile the contracts:**

   ```bash
   forge build
   ```

---

## How to Run Tests

1. Run all tests to see the exploit and the fix in action:

    ```bash
    forge test -vv
    ```

2. To see the step-by-step transaction "trace" of the exploit:

```bash
forge test --match-test test_ExploitDrainsVulnerable -vvvv
```

---

## 1. The Vulnerability

In `VulnerableContract.sol`, the `withdraw` function is unsafe because it sends money **before** updating the user's balance.

Because the contract hasn't recorded that the money is gone yet, an attacker can re-enter the function and repeatedly withdraw funds.

---

## 2. The Exploit

The `Attacker.sol` contract exploits this by:

* **Depositing** a small amount of ETH to become a valid user.
* **Withdrawing** that amount.
* **The Loop:** When ETH is sent back, it triggers the attacker's `receive()` function.
* This function immediately calls `withdraw` again before the first execution finishes.
* This continues recursively until the contract is drained.

---

## 3. The Solution

`FixedContract.sol` uses two layers of protection:

### * Checks-Effects-Interactions (CEI)

* Update the user’s balance **before** sending ETH.
* Prevents re-entry because balance is already set to 0.

### * Reentrancy Guard

* Uses a `locked` state variable via a `noReentrant` modifier.
* Prevents the function from being called again while it's still executing.

---

## 4. Test Results

* `test_ExploitDrainsVulnerable`
  Confirms the attacker successfully drains the vulnerable contract.

* `test_LegitUserCanWithdrawFromFixed`
  Confirms legitimate users can safely withdraw funds.

* `test_AttackFailsOnFixed`
  Confirms the exploit is blocked and funds remain secure.
