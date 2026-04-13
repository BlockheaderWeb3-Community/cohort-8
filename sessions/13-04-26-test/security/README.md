# Reentrancy Attack Demo

This project demonstrates a reentrancy attack on a simple bank contract and how to prevent it using a reentrancy guard.

## Files

- `src/secureBank.sol`: The secure bank contract with deposit/withdraw functions protected by a `noReentrancy` modifier.
- `src/Attackk.sol`: The attack contract that attempts to exploit reentrancy.
- `test/attackk.t.sol`: Test suite including tests for the attack and security measures.

## Running Tests

```bash
forge test
```

## Test Status

- Most tests pass, confirming the reentrancy guard works.
- `testDrain` is currently failing - this test attempts to verify that an attacker can drain the contract's funds with just 1 ETH. Since the guard prevents this, the test needs adjustment to properly assert the prevention.

## Further Work

Fix `testDrain` in `attackk.t.sol` to correctly demonstrate that the attack is blocked by the reentrancy guard.
