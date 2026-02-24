import { FaCube, FaExchangeAlt } from "react-icons/fa";

export const obg = [
  { id: 1, name: "All", link: "#" },
  { id: 2, name: "Blocks", link: "#" },
  { id: 3, name: "Transactions", link: "#" },
  { id: 4, name: "Addresses", link: "#" },
  { id: 5, name: "Tokens", link: "#" },
  { id: 6, name: "Contracts", link: "#" },
];

export const latestBlocks = [
  {
    id: 1,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353978,
    time: "9 secs ago",
    miner: "Titan Builder",
    txCount: 294,
    txTime: "12 secs",
    reward: "0.0044 ETH",
  },
  {
    id: 2,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353977,
    time: "18 secs ago",
    miner: "EtherNode",
    txCount: 210,
    txTime: "10 secs",
    reward: "0.0039 ETH",
  },
  {
    id: 3,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353976,
    time: "27 secs ago",
    miner: "BlockForge",
    txCount: 180,
    txTime: "15 secs",
    reward: "0.0050 ETH",
  },
  {
    id: 4,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353975,
    time: "35 secs ago",
    miner: "Green Miner",
    txCount: 250,
    txTime: "13 secs",
    reward: "0.0047 ETH",
  },
  {
    id: 5,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353974,
    time: "45 secs ago",
    miner: "NodeX",
    txCount: 310,
    txTime: "18 secs",
    reward: "0.0052 ETH",
  },
  {
    id: 6,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353973,
    time: "55 secs ago",
    miner: "BlockChainers",
    txCount: 280,
    txTime: "14 secs",
    reward: "0.0049 ETH",
  },
  {
    id: 7,
    icon: <FaCube className="text-green-500 w-6 h-6" />,
    blockNumber: 24353972,
    time: "1 min ago",
    miner: "AlphaMiner",
    txCount: 200,
    txTime: "12 secs",
    reward: "0.0042 ETH",
  },
];


export const latestTransactions = [
  {
    id: 1,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x91c0679d0eb5fdda39efcf44022852fdd5d6e1874925e2fef1573643449a4f97",
    time: "9 secs ago",
    from: "0x4838B106...B0BAD5f97",
    to: "0x22eEC85b...D9c6fa778",
    value: "0.01082 ETH",
  },
  {
    id: 2,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0xcda8cbbd2cec32e9a003fd9520e6ad752c857a43271a16089a0459cd3daba288",
    time: "12 secs ago",
    from: "0x6bc727Ab...2cbF35748",
    to: "0x7df9415B...8d526D1a4",
    value: "0 ETH",
  },
  {
    id: 3,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0xf467b67b2370a5400d881894bfc1440a88d493d99f641d3234cb3b32d855eb6e",
    time: "15 secs ago",
    from: "0x67dD6f6A...bfF629203",
    to: "0xD4416b13...E25686401",
    value: "0 ETH",
  },
  {
    id: 4,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x5cf5207804ebcb99143266bd660e3898bd9246cd55a18001444cc903b03c6ff5",
    time: "18 secs ago",
    from: "0x8C8D7C46...D564d7465",
    to: "0x5A22E074...576ee14b4",
    value: "0.06485 ETH",
  },
  {
    id: 5,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x48599d0846584359e34ae08d015a7b22641bf9b639ba7550b9f5f3b611ac9058",
    time: "21 secs ago",
    from: "0x4945cE2d...19Cab982b",
    to: "0xc57853C8...a28387abb",
    value: "0.00002 ETH",
  },
  {
    id: 6,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0xc2a7f68ccceb5ba41f0883c6ea00f22b0fba645285b7bbf992e15436d6618fee",
    time: "24 secs ago",
    from: "0xc6d77CD1...5BD459d9f",
    to: "0xdAC17F95...13D831ec7",
    value: "0 ETH",
  },
  {
    id: 7,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x74d9bcbb7fae9cbbd4e0df7c69c61e5b87a96c431c0fcb0f6f3dbdd4c91e3c18",
    time: "27 secs ago",
    from: "0xA91d3C92...9dC771e23",
    to: "0x4d8cB8B2...eBf67112A",
    value: "1.204 ETH",
  },
  {
    id: 8,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x7fbc9c918b8f1d63dca52c20bb3a53a2ef65d5e457f37b76f19b05db43c9f3c9",
    time: "31 secs ago",
    from: "0x8cE9A5e1...bA45f9a21",
    to: "0xF977814e...5cE2d63F9",
    value: "0.52 ETH",
  },
  {
    id: 9,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x6bb91e65a1a01c6f2b99e4a3f4f960a6f62b7e2e3f1a24a8d0d5a3b2f9c4b8a2",
    time: "35 secs ago",
    from: "0x2f318C5D...d9f92E1B3",
    to: "0x1a3F45C9...91aA0f83C",
    value: "0 ETH",
  },
  {
    id: 10,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x4f93cbb6fcd9b5d75f13d8f1c2e64b41bde1e0a84a7c7b7a1fd14f52cb4ad91e",
    time: "40 secs ago",
    from: "0xE592427A...05861564",
    to: "0x88e6A0c2...5640F5d7",
    value: "0.003 ETH",
  },
  {
    id: 11,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x92c8a4b78bde79dcae8e6cbe45a52b95dbcf53c2e68e6a8d9d3b0b45c51f4a33",
    time: "45 secs ago",
    from: "0x9A4f2C9A...1Ebd89aC2",
    to: "0x3fC91A3a...F0c26c9B",
    value: "2.45 ETH",
  },
  {
    id: 12,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x19a3d4b5a1e77a8c8dbe7ef5bbad2d1a92e0c5b5f7e3b1eac6db9f1c38d44c61",
    time: "51 secs ago",
    from: "0x742d35Cc...f44e",
    to: "0xBcd4042D...F2dAE",
    value: "0 ETH",
  },
  {
    id: 13,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0xa91b5f8d8d7b3d72a91a5b6d7c2b6a9f4a3b1d8f6c2a8d5f9e4c1b8a3d7c5f",
    time: "58 secs ago",
    from: "0xAb5801a7...bA7",
    to: "0x00000000...dEaD",
    value: "0 ETH",
  },
  {
    id: 14,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0x5c9f1a9a7f3e8b1c4d2e7a6b9f5a3d8c6b4e2a1f9d7c8b3a6e5d4f2a9c7b1",
    time: "1 min ago",
    from: "0x3C44CdDd...9cAE",
    to: "0x90F79bf6...dC42",
    value: "0.89 ETH",
  },
  {
    id: 15,
    icon: <FaExchangeAlt className="text-green-500 w-6 h-6" />,
    hash: "0xb4c2f7d8a3e9c5d6b1f4a8e7c9d2b5a6f1e3d4c8a9b7f5e6d2c1a4b3e8d9",
    time: "1 min ago",
    from: "0x15d34AAf...a65",
    to: "0x9965507D...e0C",
    value: "0.12 ETH",
  },
];



export type Block = {
  height: number;
  status: "Finalized" | "Pending";
  timestamp: string;
  proposedOn: string;

  transactions: number;
  internalTransactions: number;
  withdrawals: number;

  feeRecipient: string;
  reward: string;
  totalDifficulty: string;
  size: string;
  gasUsed: string;
  gasLimit: string;
  baseFee: string;
  burntFees: string;
  extraData: string;

  hash: string;
  parentHash: string;
  stateRoot: string;
  withdrawalsRoot: string;
  nonce: string;
};
