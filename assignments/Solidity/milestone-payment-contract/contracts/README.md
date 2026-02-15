# Client-Freelancer Milestone Payment Contract

A Solidity smart contract for managing milestone-based payments between clients and freelancers on the Ethereum blockchain.

## Overview

This contract facilitates secure, milestone-based payments for freelance work. The client creates milestones, funds them, and the freelancer completes work. Funds are released only when the client approves completed milestones.

## Contract Details

- **License**: MIT
- **Solidity Version**: ^0.8.28

## Roles

| Role | Description |
|------|-------------|
| **Client** | Creates milestones, funds them, and approves releases |
| **Freelancer** | Completes milestones and receives payment upon approval |

## Contract State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `client` | `address` | The client's wallet address |
| `freelancer` | `address` | The freelancer's wallet address |
| `totalMilestonePrice` | `uint` | Total value of all milestones |
| `counter` | `uint` | Number of milestones created |
| `pricePerMilestone` | `uint` | Price of the current milestone |
| `createdMilestones` | `bool` | Whether milestones have been created |
| `milestones` | `mapping(uint => Milestone)` | Map of milestone ID to Milestone struct |
| `completedMilestones` | `mapping(uint => uint)` | Map of completed milestone payments |

## Data Structures

### Status Enum
```solidity
enum Status {
    Pending,    // Milestone created but not completed
    Completed,  // Freelancer marked as completed
    Approved    // Client approved and funds released
}
```

### Milestone Struct
```solidity
struct Milestone {
    string description;  // Description of the work
    uint price;          // Price in ETH (wei)
    Status status;       // Current status
}
```

## Functions

### Constructor
```solidity
constructor(address _client, address _freelancer)
```
Initializes the contract with client and freelancer addresses.

**Parameters:**
- `_client`: Address of the client
- `_freelancer`: Address of the freelancer

### createMilestones
```solidity
function createMilestones(string memory _description, uint _price) public
```
Creates a new milestone. Can only be called by the client.

**Parameters:**
- `_description`: Description of the milestone
- `_price`: Price for completing this milestone (in ETH)

**Requirements:**
- Caller must be the client

### fundMilestones
```solidity
function fundMilestones() public payable
```
Funds all created milestones. Client must send exact total value.

**Requirements:**
- Caller must be the client
- Milestones must be created first
- Must send exact `totalMilestonePrice * 1 ether`

### markMilestone
```solidity
function markMilestone(uint _num) public
```
Marks a milestone as completed. Can only be called by the freelancer.

**Parameters:**
- `_num`: ID of the milestone to mark as completed

**Requirements:**
- Caller must be the freelancer
- Milestone must exist

### releaseFund
```solidity
function releaseFund(uint _num) public
```
Releases payment for a completed milestone to the freelancer.

**Parameters:**
- `_num`: ID of the milestone to release funds for

**Requirements:**
- Caller must be the client
- Milestone must exist
- Transfer must succeed

## Usage Flow

1. **Deploy**: Deploy contract with client and freelancer addresses
2. **Create Milestones**: Client calls `createMilestones()` for each milestone
3. **Fund**: Client calls `fundMilestones()` with total payment
4. **Complete Work**: Freelancer completes work and calls `markMilestone()`
5. **Release**: Client verifies work and calls `releaseFund()` to pay freelancer

## Example Usage

```javascript
// Deploy contract
const contract = await ethers.getContractFactory("ClientAndFreelancer");
const instance = await contract.deploy(clientAddress, freelancerAddress);

// Client creates milestones
await instance.createMilestones("Design mockups", 0.5); // 0.5 ETH
await instance.createMilestones("Develop frontend", 1.0); // 1.0 ETH

// Client funds all milestones (1.5 ETH total)
await instance.fundMilestones({ value: ethers.parseEther("1.5") });

// Freelancer marks first milestone as complete
await instance.markMilestone(1);

// Client releases funds for first milestone
await instance.releaseFund(1);
```

## Security Considerations

1. **Access Control**: Only the client can create milestones and release funds
2. **Access Control**: Only the freelancer can mark milestones as completed
3. **Payment Validation**: Contract requires exact payment amount
4. **Transfer Safety**: Uses `.call()` with value for ETH transfers

## Gas Costs

- Deployment: ~150,000 gas
- Create milestone: ~80,000 gas
- Fund milestones: ~50,000 gas
- Mark milestone: ~40,000 gas
- Release fund: ~30,000 gas

## Error Messages

| Error | Description |
|-------|-------------|
| "client must call function" | Function can only be called by client |
| "Freelancer must call function" | Function can only be called by freelancer |
| "Create milestones first" | Must create milestones before funding |
| "Client must pay actuel amount" | Must send exact total milestone price |
| "Invalid milestone" | Milestone ID does not exist |
| "transcation failed" | ETH transfer to freelancer failed |

## License

MIT
