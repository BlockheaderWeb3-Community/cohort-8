// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleCrowdfunding {
  bool private locked;

  modifier nonReentrant() {
    require(!locked, "Reentrancy");
    locked = true;
    _;
    locked = false;
  }
  address public owner;
  uint256 public goal;
  uint256 public deadline;
  uint256 public totalRaised;
  bool public withdrawn;

  mapping(address => uint256) public contributions; // Tracks each contributor's amount.

  event Contribution(address indexed contributor, uint256 amount);
  event Withdraw(address indexed owner, uint256 amount);
  event Refund(address indexed contributor, uint256 amount);

  constructor(uint256 _goal, uint256 _deadline) {
    require(_goal > 0, "Goal must be > 0");
    require(_deadline > block.timestamp, "Deadline must be future");
    owner = msg.sender;
    goal = _goal;
    deadline = _deadline;
  }

  function contribute() public payable {
    require(block.timestamp < deadline, "Funding ended");
    require(msg.value > 0, "Must send ETH");
    require(!withdrawn, "Already withdrawn");
    contributions[msg.sender] += msg.value;
    totalRaised += msg.value;
    emit Contribution(msg.sender, msg.value);
  }

  function withdraw() external nonReentrant {
    require(msg.sender == owner, "Only owner");
    require(totalRaised >= goal, "Goal not met");
    require(!withdrawn, "Already withdrawn");
    withdrawn = true;
    uint256 amount = address(this).balance;
    (bool ok, ) = payable(owner).call{value: amount}("");
    require(ok, "Withdraw failed");
    emit Withdraw(owner, amount);
  }

  function refund() external nonReentrant {
    require(block.timestamp >= deadline, "Too early");
    require(totalRaised < goal, "Goal met");
    uint256 amount = contributions[msg.sender];
    require(amount > 0, "No contribution");
    contributions[msg.sender] = 0;
    (bool ok, ) = payable(msg.sender).call{value: amount}("");
    require(ok, "Refund failed");
    emit Refund(msg.sender, amount);
  }

  receive() external payable {
    contribute();
  }
}
