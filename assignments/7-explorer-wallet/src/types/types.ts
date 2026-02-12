export interface RpcBlock {
  number: string; // hex
  hash: string;
  parentHash: string;
  timestamp: string; // hex unix seconds
  miner: string;
  gasUsed: string; // hex wei
  gasLimit: string; // hex wei
  transactions: string[] | RpcTransaction[]; // hashes or full txs
}

export interface RpcTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string; // hex wei
  gas: string; // hex
  gasPrice: string; // hex wei
  input: string;
  blockNumber: string; // hex
  transactionIndex: string; // hex
}

export interface RpcTransactionReceipt {
  status: string; // hex '0x1' or '0x0'
  gasUsed: string; // hex
}




