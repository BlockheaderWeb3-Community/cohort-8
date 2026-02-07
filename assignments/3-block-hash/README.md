Read the Mastering Ethereum book and document your findings from the first (1) and sixth (6) chapter comprehensively in a hackMD file. Mastering Bitcoin Book
Write an algorithm to derive the block hash.
Summarize what's inside a transaction. Talk about it.

# Assignment 3
## Chapter 1. What is Ethereum?
Ethereum is ofte described as the "world computer". 
From a computer science perspective, Ethereum is a deterministic but practically unbounded state machine, consisting of a globally accessible singleton state and a virtual machine that applies changes to that state.
Ethereum is more practically described as an open-source, globally decentralized computing infrastructure that executes programs called smart contract.

The Ethereum platform enables developers to build powerful decentralized applications with built-in economic functions. It provides high availability, auditability, transparency, and neutrality while reducing or eliminating censorship and reducing certain counterparty risks.

**Ethereum compared to Bitcoin**

Yes Ethereum has striking similarities to blockchain currencies that was established before it including Bitcoin and it also has a digital currency (ether), but both the purpose and the construction of Ethereum are strikingly different from those of the open blockchains that preceeded it, including Bitcoin.

Ethereum's purpose is not primarily to be a digital currency payment network. While the digital currency ether is both integral to and necessary for the operation of Ethereum, ether is intended as a utility currency to pay for use of Ethereum platform as the worl computer.
Unlike Bitcoin, which has a very limited scripting language, Ethereum is designed to be a general-purpose, programmable blockchain that runs a virtual machine capable of executing code of arbitrary and unbounded complexity.
Ethereum can function as a general-purpose computer, where Bitcoin's Script language is intentionally constrained to simple true/false evaluation of spending conditions.

In September 2022, Ethereum further distinguished itself from Bitcoin With **The Merge Upgrade** by transitioning its consensus model from proof of work (PoW) to proof of stake (PoS).

**`!!! Investigate further what PoW and PoS really means`**.

### Components of a Blockchain 
The components of an open, public blockchain are (usually) as follows:
- A P2P network connecting participants and propagating transaction and blocks of verified transactions, based on a standardized "gossip" protocol
- Messages, in the formof transactios, representing state transitions
- A set of consensus rules governing what constitutes a transaction and what makes for a valid state transition
- A state machine that processes transactions according to the consensus rules
- A chain of cryptographically secured blocks that acts as a journal of all the verified and accepted state transitions
- A consensus algorithm that decentralizes control over the blockchain by forcing participants to cooperate in the enforcement of the consensus rules
- A game-theory-sound incentivization scheme (e.g., PoW costs plus block rewards) to economically secure the state machine in an open environment
- One or more open source software implementations of these components ("clients")

Keywords like *open*, *public*, *global decentralized*, *neutral*, and *censorship resistant*, can help us to identify the important emergent characteristics of a "blockchain" system.
We can broadly categorize blockchains into permissioned versus permissionless and public and private:
**Permissionless and Permissioned**: The former is a blockchain that's accessible to anyone like Ethereum and Bitcoin. The  decentralized network allows anyone to join, participate in the consensus process, and read and write data, prompting trust and transparency. 
while the latter is the opposite. There's restricted access and only authorized participants can join the network and perform some actions.
**Public and Private** 
Public blockchains are decentralized and open to anyone. This promotes broad participation in network activities while private blockchains limit access to a specific group of participants, often within organizations or among trusted partners.

### The Birth of Ethereum
Why?!!! 

Ethereum's founders were thinking about a blockchain without a specific purpose, which could support a broad variety of applications by being *programmed*. The idea was that by using a genral-purpose blockchain like Ethereum, a developer could program their particular application without having to implement the underlying mechanisms of P2P networks, blockchains, consensus algorithms, and the like.

Ethereum abstracts away those details and offeres a deterministic, secure environment for writing decentralized applications. This doesn't only make development easier but expanded the scope (what it could do) of blockchain. Hence the birth of NFTs, decentralized autonomous organizations (DAOs), which wouldn't have been feasible with earlier single-purpose blockchains.

**`!!! What are DAOs?`**.

### Ethereum's Stages of Development 

The four stages of Ethereum's devlopment arelisted below:

- **Frontier (July 30, 2015):** The was block (Genesis) was mined on this day. This laid the foundation for other developers and miners by enabling the setup of mining rigs, the initiation of the ETH token trading, and testing od DApps in a minimal network setting.
Initially, the block had a gas limit of five thousand (5,000), but that was lifted in September 2015, allowing for transactions and introducing the *difficulty bomb*.
Ethereum *difficulty bomb* is a mechanism that's designed to make minimg over time, exponentially difficult, ultimately, making it infeasible.
- **Homestead (March 14, 2016):** This stage started at block 1,150,000. Although the network remained in the beta phase, Homestead made Ethereum safer and more stable through key protocol updates (EIP-2, EIP-7, and EIP-*). These upgrades enhanced developer friendliness and paved the way for further protocol improvements.
- **Metropolis (October 16, 2017):** THis stage started at block 4,370,000. This stage aimed to foster DApp creation and overall network utility. With this stage, we have optimized gas costs, enhanced security, introduced L2 scaling solutions, reduced minimg reward and so on. These improvements set the stage for Ethereum 2.0, representing the final phase of Ethereum 1.0.
- **Serenity (September 15, 2022):** Comonly known as *Ethereum 2.0*, represents a major upgrade aimed at transforming Ethereum from a PoW to a PoS consensus mechanism. Its focus is to ensure Ethereum is sustainable and capable of handling a growing number of users and applications. This stage addresses critical issues like high energy consumption and network congestion which clears the road for a more robust and efficient blockchain. This stage is divided into several substages that handled/addressed specific aspects of the network's evolution.

**Sharding** helps Ethereum to scale by splitting the etwork into smaller, manageable pieces, which allows for more transactions per second.  

### Ethereum: A General Purpose Blockchain
The original blockchain-Bitcoin-traks the state of units of Bitcoin and their ownership. 
Alternatively, it can be seen as a distributed-consensus *state machine*, where transactions cause a *global state transition*, altering the ownership of the coins.
The rules of consensus guides the state transitions, allowing all participants to eventually converge (consensus) on a common state of the system, after several blocks are mined.

Similarly, Ethereum is also a state machine. However it distinguishes itselft by not only tracking the state of current ownership, but also traks the state of transitions of a general-purpose data store   (data expressible as a *key-value tuple*).

Like a general-purpose stored-program computer, it stores data and the code and also tracks how the data changes over time. It can load code into its state machine and run that code, storing the resulting changes in its blockchain.

Two of the most critical differences from the most general-purpose computers are that **Ethereum state changes are governed by the rules of consensus** and that its **state is distributed globally**.

Ethereum answers the question "**What if we could track any arbitrary state and program the state machine to create a worldwide computer operating under consensus?**"

### Ethereum's Components
The components of a blockchain are more specifically as follows:

- **P2P network:** Ethereum runs on the main Ethereum network, which is addressable on TCP port 30303, and runs a protocol called *`DEVp2p`*.
- **Consensus rules:** Ethereum's original protocol was *Ethash*, a PoW model defined in the reference specification: the "Yellow Paper". It then evolved to the PoS in September 2022 during The Merge upgrade.
- **Transactions:** Ethereum transactions are network messages that include (among other things) a sender, a recipient, a value, and a data payload.
- **State Machine:** Ethereum state transitions are processed by the *Ethereum Virtual Machine (EVM)*, a stack-based virtual machine that executes bytecodes (machine-language instructions). EVM programs called *smart contracts* are written in high-level languages and combiled to bytecode for execution on the EVM.
- **Data structures:** Ethereum's state is stored locally on each node as a *database* (usually Google's LevelDB), which contains the transactions and system state in a serialized hashed data structure called a *Merkle-Patricia trie*.
- **Consensus algorithm:** In PoS consensus mechanism, validators stake their cryptocurrency to earn the right to validate transactions, create new blocks, and maintain network security.
- **Economic security:** To provide security to the blockchain, Ethereum uses a PoS algorithm called Gasper.
- **Clients** 

### Ethereum and Turing Completeness
Ethereum's ability toexecute a stored program-in a state machine called the EVM-while reading and writing data to memory makes it a Turing-complete system and therefore a Universal Turing Machine (UTM).

Ethereum's groundbreaking innovation is to combine the general-purpose computing architecture of a stored-program computer with a decentralized blockchain, thereby creating a distributed single-data (singleton) worl computer. Ethereum programs run "everywhere" yet produce a common state that is secured by the rules of consensus.

### Implications os Turing Completeness
Turing proved that we cannot predict whether a program will terminate by simulating it on a computer.
Turing-complete systems can run in *infinite loops* - a program that does not terminate - oversimplication.

Now, it'll be trivial to create a program that runs a loop that never ends. But, unintended never-ending loops can arise without warning due to complex interactions between the starting condition and the code.

We can't prove/predict how long the program/smart contract will run without actually running it (What if it runs forever). Whether intentional or not, a smart contract can be created such that it runs forever when a node/client tries to validate it.

In a world computer, a program that abuses resources gets to abuse the world's resources. How does Ethereum constrain the resources used by a smart contract if it cannot predict resource use in advance?







