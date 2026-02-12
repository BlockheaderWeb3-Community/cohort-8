
import { useQuery } from '@tanstack/react-query';
import type {
  RpcBlock,
  RpcTransaction,
  RpcTransactionReceipt,
} from '../types/types';
import {
  getEthPriceUSD,
  getGasPrice,
  getRecentBlocks,
  getRecentTransactions,
  getBlockByNumber,
  getTransactionByHash,
  getTransactionReceipt,
} from '../services/rpc';

// Eth Price
export function useEthPrice() {
  return useQuery<number, Error>({
    queryKey: ['ethPrice'],
    queryFn: getEthPriceUSD,
    refetchInterval: 60_000, // ms
  });
}

// Gas Price
export function useGasPrice() {
  return useQuery<string, Error>({
    queryKey: ['gasPrice'],
    queryFn: getGasPrice,
    refetchInterval: 10_000,
  });
}

// Recent Blocks
export function useRecentBlocks(count = 10) {
  return useQuery<RpcBlock[], Error>({
    queryKey: ['recentBlocks', count],
    queryFn: () => getRecentBlocks(count),
  });
}

// Recent Blocks
export function useRecentTransactions(count = 10) {
  return useQuery<RpcTransaction[], Error>({
    queryKey: ['recentTransactions', count],
    queryFn: () => getRecentTransactions(count),
  });
}

// Single Block
export function useBlock(blockNumber: number) {
  return useQuery<RpcBlock, Error>({
    queryKey: ['block', blockNumber],
    queryFn: () => getBlockByNumber(blockNumber, true),
    enabled: Number.isFinite(blockNumber),
  });
}

// Transaction Receipt
type TransactionData = {
  tx: RpcTransaction;
  receipt: RpcTransactionReceipt;
};

export function useTransaction(txHash: string) {
  return useQuery<TransactionData, Error>({
    queryKey: ['transaction', txHash],
    queryFn: async () => {
      const [tx, receipt] = await Promise.all([
        getTransactionByHash(txHash),
        getTransactionReceipt(txHash),
      ]);

      return { tx, receipt };
    },
    enabled: !!txHash,
  });
}
