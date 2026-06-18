ETHEREUM BOOK CHAPT.1
Overview.

From a computer science perspective, Ethereum is a deterministic but practically unbounded state machine, consisting of a globally accessible singleton state and a virtual machine that applies changes to that state. in a simple term Ethereum is a decentralized, open-source blockchain platform that enables developers to build and deploy smart contracts and decentralized applications.

COMPONENT OF BLOCKCHAIN
Permissionless:

Permissionless blockchains, like Bitcoin and Ethereum, are accessible to anyone. These decentralized networks allow anyone to join, participate in the consensus process, and read and write data, promoting trust through transparency.

Permissioned:

Permissioned blockchains restrict access, allowing only authorized participants to join the network and perform certain actions.

Public:

Public blockchains are decentralized and open to everyone, allowing broad participation in network activities and ensuring transparency through widespread distribution and consensus mechanisms.

Private:

Private blockchains limit access to a specific group of participants, often within organizations or among trusted partners.

_ETHEREUM STAGES of DEVELOPMENT_
The four main development stages are codenamed Frontier, Homestead, Metropolis, and Serenity.The Serenity stage has been further broken down into six substages codenamed The Merge, The Surge, The Scourge, The Verge, The Purge, and The Splurge.

\*FRONTIER: Frontier prepared the foundation for miners and developers by enabling the setup of mining rigs, the initiation of ETH token trading, and the testing of decentralized applications (DApps) in a minimal network setting

\*HOMESTEADS:Homestead made Ethereum safer and more stable through key protocol updates (EIP-2, EIP-7, and EIP-8).These upgrades enhanced developer friendliness and paved the way for further protocol improvements.

\*METROPOLIS: Metropolis aimed to increase network functionality, fostering DApp creation and overall network utility.

\*SERENITY:Serenity focuses on making Ethereum more sustainable and capable of handling a growing number of users and applications. This stage addresses critical issues like high energy consumption and network congestion, clearing the way for a more robust and efficient blockchain.The Serenity is divided into several substages, each addressing specific aspects of the network’s evolution.the five Serenity substages are being developed at the same time

1.The merge: The Merge combines Ethereum’s mainnet with the Beacon Chain (The Beacon Chain is the backbone of Ethereum's proof-of-stake consensus system,The Beacon Chain manages the validator registry, implements the consensus rules, and distributes rewards and penalties.)it officially transitioning the network to PoS and reducing energy consumption significantly.

2.The Surge:
The Surge introduces sharding, increasing Ethereum’s scalability by splitting the network into smaller, manageable pieces, which allows for more transactions per second.

3.The Purge:
The Purge aims to reduce the historical data stored on Ethereum,simplifying node operation and lowering network congestion.

The Splurge:The Splurge includes various minor upgrades and optimizations to ensure that Ethereum runs smoothly and efficiently after all major changes are implemented.

ETHEREUM COMPONENT

\*P2P network:
Ethereum runs on the Ethereum main network, which is addressable on TCP port 30303, and runs a protocol called ÐΞVp2p.

\*Consensus rules:
Ethereum’s original consensus protocol was Ethash, a PoW model defined in the reference specification: the “Yellow Paper.” It then evolved to PoS in September 2022 during The Merge upgrade (see Chapter 15).

\*Transactions:
Ethereum transactions are network messages that include (among other things) a sender, a recipient, a value, and a data payload.

\*State machine:
Ethereum state transitions are processed by the Ethereum Virtual Machine (EVM), a stack-based virtual machine that executes bytecode (machine-language instructions). EVM programs called smart contracts are written in high-level languages (e.g., Solidity) and compiled to bytecode for execution on the EVM.

\*Data structures:
Ethereum’s state is stored locally on each node as a database (usually Google’s LevelDB), which contains the transactions and system state in a serialized hashed data structure called a Merkle-Patricia trie.

\*Consensus algorithm:
Ethereum transitioned from a PoW to a PoS consensus mechanism to enhance energy efficiency and scalability. In PoS, validators stake their cryptocurrency to earn the right to validate transactions, create new blocks, and maintain network security. Ethereum’s PoS is the fusion of two distinct algorithms: Casper the Friendly Finality Gadget (FFG) and GHOST (Greedy Heaviest Observed Subtree) with latest message driven (LMD) updates (more on this in Chapter 15).

\*Economic security:
Ethereum uses a PoS algorithm called Gasper that provides economic security to the blockchain. We’ll explore how Gasper works in detail in Chapter 15, including its role in finality and validator coordination.

\*Clients:
Ethereum has several interoperable implementations of its execution and consensus client software, the most prominent of which are go-ethereum (Geth) and Nethermind for execution and Prysm and Lighthouse for consensus.

WHY WE LEARN ETHEREUM
Ethereum is a great platform for learning about blockchains, ethereum combine multiple disciplines into one domain: programming, information security, cryptography, economics, distributed systems, P2P networks, and so on. Ethereum makes this learning curve a lot less steep, so you can get started quickly. But just below the surface of a deceptively simple environment lies a lot more. As you learn and start looking deeper, there’s always another layer of complexity and wonder.

CHAPTER (six)
Overview.

Transactions are signed messages originated by an externally owned account, transmitted by the Ethereum network, and recorded on the Ethereum blockchain

TRANSACTION TYPES

\*Legacy type:A legacy transaction is a serialized binary message,basically it convert data from its original structure like objects, arrays, or complex data typesinto a compact binary format for storage or transmission.

\*EIP-2930 Transactions:these type of transaction are equal to the previous transaction type, but with a new field called (access list). It's an array of (addresses, storage slots) that lets a user prepay for addresses and storage slots that are going to be touched by the transaction.

\*EIP-1559 Transactions:They completely change the structure of the fee market on Ethereum by introducing a new protocol parameter: the base fee.The base fee represents the minimum fee you need to pay to send a transaction on the Ethereum network.

\*EIP-4844 Transactions: They are also called blob-carrying transactions because they come with a sidecar—a blob—which contains a large amount of data.

\*EIP-7702 Transactions:They allow EOAs(Externally Owned Account)to set the code in their account. Traditionally, EOAs have an empty code; they can just start a transaction but cannot really perform complex operations, unless they are interacting with a smart contract. EIP-7702 changes this, making it possible for EOAs to do operations such as the following.

TRANSACTION NONCE
Is a counter that tracks the number of transactions sent from an account (specifically an EOA - Externally Owned Account).
