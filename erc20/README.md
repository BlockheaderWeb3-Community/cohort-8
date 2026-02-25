<!-- faith@FAITHY:~/blockchain-projects/erc20$ npx hardhat build

Compiled 1 Solidity file with solc 0.8.28 (evm target: cancun)
No Solidity tests to compile
faith@FAITHY:~/blockchain-projects/erc20$ npx hardhat ignition deploy ignition/modules/ERC721.ts --network sepolia
[hardhat-keystore] Enter the password: **************
✔ Confirm deploy to network sepolia (11155111)? … yes



Hardhat Ignition 🚀

Resuming existing deployment from ./ignition/deployments/chain-11155111

Deploying [ ERC721Module ]

Warning - previously executed futures are not in the module:
 - ERC20Module#ERC20

Batch #1
  Executed ERC721Module#ERC721

[ ERC721Module ] successfully deployed 🚀

Deployed Addresses

ERC20Module#ERC20 - 0xCa6568F3f296657F1746292853FA24b86373A3A2
ERC721Module#ERC721 - 0xe4f44FCB12bfe1996163106177c44FA64560A9Ff
faith@FAITHY:~/blockchain-projects/erc20$ npx hardhat verify --network sepolia token/contract address constructors -->

<!-- Verify -->

<!-- faith@FAITHY:~/blockchain-projects/erc20/contracts$ npx hardhat keystore set SEPOLIA_RPC_URL --force
[hardhat-keystore] Enter the password: **************
[hardhat-keystore] Enter secret to store in the production keystore: ********************
Key "SEPOLIA_RPC_URL" set in the production keystore
faith@FAITHY:~/blockchain-projects/erc20/contracts$ npx hardhat verify --network sepolia --contract contracts/ERC721.sol:ERC721 0xe4f44FCB12bfe1996163106177c44FA64560A9Ff "DEFI-WOMAN" "WIDNFT" "ipfs://bafybeihwaq4ucad3mu2sgrtynahjqhzwwategsizfn4vpgthg7lxcwg4g4/"

=== Etherscan ===
[hardhat-keystore] Enter the password: **************
HHE80029: The Etherscan API key is empty.

=== Blockscout ===
HHE80001: The request to https://eth-sepolia.blockscout.com/api failed with the message "". This error comes from Blockscout, not Hardhat.

=== Sourcify ===

📤 Submitted source code for verification on Sourcify:

  contracts/ERC721.sol:ERC721
  Address: 0xe4f44FCB12bfe1996163106177c44FA64560A9Ff

⏳ Waiting for verification result...


✅ Contract verified successfully on Sourcify!

  contracts/ERC721.sol:ERC721
  Explorer: https://sourcify.dev/server/repo-ui/11155111/0xe4f44FCB12bfe1996163106177c44FA64560A9Ff -->

  <!-- MINT -->

  <!-- faith@FAITHY:~/blockchain-projects/erc20$ npx hardhat run scripts/mint.ts

Wallet connected: 0x32e431575062f115be156a19C13bA4aa29d44065
Sending mint transaction for Token #1...
Transaction sent! Hash: 0x76bbd34b903f21dae629d9a691b81b62618b3b4d1fee7d63ba5cb394d9755acd
Waiting for block confirmation...
✅ Minted Token 1 successfully!
faith@FAITHY:~/blockchain-projects/erc20$  -->

