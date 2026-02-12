import type {
  RpcBlock,
  RpcTransaction,
  RpcTransactionReceipt,
} from '../types/types';

const RPC_ENDPOINT = 'https://ethereum-rpc.publicnode.com';

interface RpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: unknown[];
  id: number;
}

interface RpcResponse<T> {
  jsonrpc: '2.0';
  id: number;
  result: T;
  error?: { code: number; message: string };
}

async function rpcPost<T>(method: string, params: unknown[] = []): Promise<T> {
  const payload: RpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: Date.now(),
  };

  const res = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP error: ${res.status}`);
  }

  const json = (await res.json()) as RpcResponse<T>;
  if (json.error) {
    throw new Error(`RPC error: ${json.error.message}`);
  }

  return json.result;
}

// eth_gasPrice: Current eth price.
export async function getEthPriceUSD(): Promise<number> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  );

  if (!res.ok) {
    throw new Error('Price fetch failed');
  }

  const json = await res.json();
  return json.ethereum.usd;
}

// eth_gasPrice: Current gas price (hex wei).
export async function getGasPrice(): Promise<string> {
  return rpcPost<string>('eth_gasPrice');
}

// eth_blockNumber: Returns latest block number (hex).
export async function getBlockNumber(): Promise<number> {
  const hex = await rpcPost<string>('eth_blockNumber');
  return parseInt(hex, 16);
}

// eth_getBlockByNumber: Fetches block by number/tag.
export async function getBlockByNumber(
  block: string | number,
  fullTx: boolean = false
): Promise<RpcBlock> {
  const blockParam =
    typeof block === 'number' ? `0x${block.toString(16)}` : block;
  return rpcPost<RpcBlock>('eth_getBlockByNumber', [blockParam, fullTx]);
}

// eth_getTransactionByHash: Fetches transaction by hash.
export async function getTransactionByHash(
  hash: string
): Promise<RpcTransaction> {
  return rpcPost<RpcTransaction>('eth_getTransactionByHash', [hash]);
}

// eth_getTransactionReceipt: Fetches receipt for status/gas.
export async function getTransactionReceipt(
  hash: string
): Promise<RpcTransactionReceipt> {
  return rpcPost<RpcTransactionReceipt>('eth_getTransactionReceipt', [hash]);
}

// Fetch recent blocks via loop.
export async function getRecentBlocks(count: number = 10): Promise<RpcBlock[]> {
  const latest = await getBlockNumber();
  const blocks: RpcBlock[] = [];
  for (let i = 0; i < count; i++) {
    const block = await getBlockByNumber(latest - i, false);
    blocks.push(block);
  }
  return blocks;
}

// Recent transactions from recent blocks.
export async function getRecentTransactions(
  count: number = 10
): Promise<RpcTransaction[]> {
  const recentBlocks = await getRecentBlocks(5);
  const txHashes: string[] = recentBlocks.flatMap(
    (b) => b.transactions as string[]
  );
  const recentTxHashes = txHashes.slice(0, count);
  const txs: RpcTransaction[] = [];
  for (const hash of recentTxHashes) {
    const tx = await getTransactionByHash(hash);
    txs.push(tx);
  }
  return txs;
}
