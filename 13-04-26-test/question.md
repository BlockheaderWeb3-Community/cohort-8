### Questions:
- Identify the vulnerability in this contract.
- Explain how an attacker can exploit it.
- Rewrite the withdraw function to fix the issue.
```
mapping(address => uint256) public balances;

function deposit() public payable {
    balances[msg.sender] += msg.value;
}

function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");

    balances[msg.sender] -= amount;
}
```

### Your Tasks:
1. Write an attack contract that exploits this vulnerability
2. Demonstrate the exploit using a test
3. Fix the contract using:
    - Checks-Effects-Interactions pattern
    - Reentrancy guard
4. Write tests proving:
    - Attack fails after fix
    - Legit users can still withdraw