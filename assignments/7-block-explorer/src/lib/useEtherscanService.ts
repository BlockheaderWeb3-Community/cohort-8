'use client';

import {
  createApiService,
  createInfiniteApiService,
  createMutationService,
  useApiService,
} from '@/lib/api/useApiService';
import {
  API_ENDPOINTS,
  PaginationParams,
  EtherscanParams,
} from '@/lib/api/config';
import { formatNumber } from '@/lib/utils';

// Types
export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface Block {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
  uncleInclusionReward: string;
}

export interface TokenInfo {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
}

export interface GasOracle {
  LastBlock: string;
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

export interface EthereumStats {
  ethPrice: number;
  priceChange: number;
  totalTransactions: string;
  gasPrice: number;
  lastFinalizedBlock: number;
  lastSafeBlock: number;
  tps: number;
  marketCap?: number;
  networkUtilization?: number;
}

// Account service
export const useAccountService = () => {
  const baseService = createApiService({
    config: {
      staleTime: 2 * 60 * 1000, // 2 minutes for account data
    },
  });

  const infiniteService = createInfiniteApiService<
    PaginatedResponse<Transaction>
  >({
    pageSize: 10,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.result.length === 0) return undefined;
      return allPages.length + 1;
    },
  });

  return {
    // Get account balance
    useAccountBalance: (address: string) =>
      baseService({
        queryKey: ['account', 'balance', address],
        url: API_ENDPOINTS.ACCOUNT_BALANCE,
        params: {
          module: 'account',
          action: 'balance',
          address,
          tag: 'latest',
        },
      }),

    // Get account transactions
    useAccountTransactions: (address: string, pagination?: PaginationParams) =>
      infiniteService({
        queryKey: ['account', 'transactions', address],
        url: API_ENDPOINTS.ACCOUNT_TRANSACTIONS,
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: pagination?.page || 1,
          offset: pagination?.offset || 10,
          sort: pagination?.sort || 'desc',
        },
      }),

    // Get internal transactions
    useInternalTransactions: (address: string, pagination?: PaginationParams) =>
      infiniteService({
        queryKey: ['account', 'internal', address],
        url: API_ENDPOINTS.ACCOUNT_INTERNAL_TXS,
        params: {
          module: 'account',
          action: 'txlistinternal',
          address,
          page: pagination?.page || 1,
          offset: pagination?.offset || 10,
          sort: pagination?.sort || 'desc',
        },
      }),

    // Get token transfers
    useTokenTransfers: (
      address: string,
      contractAddress?: string,
      pagination?: PaginationParams
    ) =>
      infiniteService({
        queryKey: ['account', 'token-transfers', address, contractAddress],
        url: API_ENDPOINTS.ACCOUNT_TOKEN_TRANSFERS,
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          contractaddress: contractAddress,
          page: pagination?.page || 1,
          offset: pagination?.offset || 10,
          sort: pagination?.sort || 'desc',
        },
      }),
  };
};

// Transaction service
export const useTransactionService = () => {
  const baseService = createApiService();

  return {
    // Get transaction info
    useTransactionInfo: (txhash: string) =>
      baseService({
        queryKey: ['transaction', 'info', txhash],
        url: API_ENDPOINTS.TRANSACTION_INFO,
        params: {
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash,
        },
      }),

    // Get transaction receipt
    useTransactionReceipt: (txhash: string) =>
      baseService({
        queryKey: ['transaction', 'receipt', txhash],
        url: API_ENDPOINTS.TRANSACTION_RECEIPT,
        params: {
          module: 'proxy',
          action: 'eth_getTransactionReceipt',
          txhash,
        },
      }),

    // Watch transaction (polling)
    useWatchTransaction: (txhash: string, enabled = true) =>
      baseService({
        queryKey: ['transaction', 'watch', txhash],
        url: API_ENDPOINTS.TRANSACTION_RECEIPT,
        params: {
          module: 'proxy',
          action: 'eth_getTransactionReceipt',
          txhash,
        },
        config: {
          refetchInterval: 3000, // Poll every 3 seconds
          refetchIntervalInBackground: true,
          enabled: enabled && !!txhash,
        },
      }),
  };
};

// Block service
export const useBlockService = () => {
  const baseService = createApiService();
  const infiniteService = createInfiniteApiService<PaginatedResponse<Block>>({
    pageSize: 20,
  });

  return {
    // Get block info
    useBlockInfo: (blockNumber: number | 'latest') =>
      baseService({
        queryKey: ['block', 'info', blockNumber],
        url: API_ENDPOINTS.BLOCK_INFO,
        params: {
          module: 'proxy',
          action: 'eth_getBlockByNumber',
          tag:
            blockNumber === 'latest'
              ? 'latest'
              : `0x${blockNumber.toString(16)}`,
          boolean: 'true',
        },
      }),

    // Get block reward
    useBlockReward: (blockNumber: number) =>
      baseService({
        queryKey: ['block', 'reward', blockNumber],
        url: API_ENDPOINTS.BLOCK_REWARD,
        params: {
          module: 'block',
          action: 'getblockreward',
          blockno: blockNumber,
        },
      }),

    // Get recent blocks (infinite scroll)
    useRecentBlocks: (pagination?: PaginationParams) =>
      infiniteService({
        queryKey: ['blocks', 'recent'],
        url: API_ENDPOINTS.HISTORICAL_BLOCKS,
        params: {
          module: 'block',
          action: 'getblocknobytime',
          closest: 'before',
          page: pagination?.page || 1,
          offset: pagination?.offset || 20,
        },
      }),
  };
};

// Token service
export const useTokenService = () => {
  const baseService = createApiService();

  return {
    // Get token info
    useTokenInfo: (contractAddress: string) =>
      baseService({
        queryKey: ['token', 'info', contractAddress],
        url: API_ENDPOINTS.TOKEN_INFO,
        params: {
          module: 'token',
          action: 'tokeninfo',
          contractaddress: contractAddress,
        },
      }),

    // Get token supply
    useTokenSupply: (contractAddress: string) =>
      baseService({
        queryKey: ['token', 'supply', contractAddress],
        url: API_ENDPOINTS.TOKEN_SUPPLY,
        params: {
          module: 'stats',
          action: 'tokensupply',
          contractaddress: contractAddress,
        },
      }),

    // Get token balance
    useTokenBalance: (contractAddress: string, address: string) =>
      baseService({
        queryKey: ['token', 'balance', contractAddress, address],
        url: API_ENDPOINTS.TOKEN_BALANCE,
        params: {
          module: 'account',
          action: 'tokenbalance',
          contractaddress: contractAddress,
          address,
          tag: 'latest',
        },
      }),
  };
};

// Gas tracker service
export const useGasService = () => {
  const baseService = createApiService({
    config: {
      refetchInterval: 15000, // 15 seconds for gas prices
      refetchIntervalInBackground: true,
    },
  });

  return {
    // Get gas oracle
    useGasOracle: () =>
      baseService<{ result: GasOracle }>({
        queryKey: ['gas', 'oracle'],
        url: API_ENDPOINTS.GAS_ORACLE,
        params: {
          module: 'gastracker',
          action: 'gasoracle',
        },
      }),

    // Get gas estimate
    useGasEstimate: () =>
      baseService({
        queryKey: ['gas', 'estimate'],
        url: API_ENDPOINTS.GAS_ESTIMATE,
        params: {
          module: 'gastracker',
          action: 'gasestimate',
          gasprice: 2000000000,
        },
      }),
  };
};

// Stats service
export const useStatsService = () => {
  const baseService = createApiService({
    config: {
      refetchInterval: 30000, // 30 seconds for stats
    },
  });

  return {
    // Get ETH price
    useEthPrice: () =>
      baseService<{ result: { ethusd: string } }>({
        queryKey: ['stats', 'eth-price'],
        url: API_ENDPOINTS.ETH_PRICE,
        params: {
          module: 'stats',
          action: 'ethprice',
        },
      }),

    // Get ETH supply
    useEthSupply: () =>
      baseService({
        queryKey: ['stats', 'eth-supply'],
        url: API_ENDPOINTS.ETH_SUPPLY,
        params: {
          module: 'stats',
          action: 'ethsupply',
        },
      }),

    // Get network stats
    useNetworkStats: () =>
      baseService({
        queryKey: ['stats', 'network'],
        url: API_ENDPOINTS.NETWORK_STATS,
        params: {
          module: 'stats',
          action: 'ethsupply2',
        },
      }),

    // Get comprehensive Ethereum stats (combined)
    useEthereumStats: () =>
      baseService<EthereumStats>({
        queryKey: ['stats', 'ethereum'],
        url: API_ENDPOINTS.NETWORK_STATS,
        params: {
          module: 'stats',
          action: 'ethsupply2',
        },
        config: {
          select: (data: any) => {
            // Transform API data to our format
            return {
              ethPrice: parseFloat(data.result.ethusd),
              priceChange: 0, // Would come from another API
              totalTransactions: formatNumber(3232750000), // Static for demo
              gasPrice: 0.105,
              lastFinalizedBlock: 24354972,
              lastSafeBlock: 24355004,
              tps: 26.1,
              marketCap: parseFloat(data.result.ethusd) * 120000000, // Approx
              networkUtilization: 0.45,
            };
          },
        },
      }),
  };
};

// Contract service with mutations
export const useContractService = () => {
  const baseService = createApiService();
  const mutationService = createMutationService();

  return {
    // Get contract ABI
    useContractABI: (address: string) =>
      baseService({
        queryKey: ['contract', 'abi', address],
        url: API_ENDPOINTS.CONTRACT_ABI,
        params: {
          module: 'contract',
          action: 'getabi',
          address,
        },
      }),

    // Get contract source code
    useContractSource: (address: string) =>
      baseService({
        queryKey: ['contract', 'source', address],
        url: API_ENDPOINTS.CONTRACT_SOURCE,
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address,
        },
      }),

    // Verify contract (mutation)
    useVerifyContract: () =>
      mutationService({
        mutationKey: ['contract', 'verify'],
        url: API_ENDPOINTS.VERIFY_CONTRACT,
        method: 'POST',
        config: {
          onSuccess: (data) => {
            console.log('Contract verified successfully:', data);
          },
          onError: (error) => {
            console.error('Contract verification failed:', error);
          },
        },
      }),
  };
};

// Main service hook (aggregates all services)
export function useEtherscanService() {
  const apiService = useApiService();

  return {
    // Service instances
    account: useAccountService(),
    transaction: useTransactionService(),
    block: useBlockService(),
    token: useTokenService(),
    gas: useGasService(),
    stats: useStatsService(),
    contract: useContractService(),

    // Utility functions
    invalidateAccountData: (address: string) => {
      apiService.invalidateQueries(['account', address]);
    },

    prefetchBlockData: (blockNumber: number) => {
      apiService.prefetchQuery({
        queryKey: ['block', 'info', blockNumber],
        queryFn: async () => {
          const response = await apiClient.get(API_ENDPOINTS.BLOCK_INFO, {
            params: {
              module: 'proxy',
              action: 'eth_getBlockByNumber',
              tag: `0x${blockNumber.toString(16)}`,
              boolean: 'true',
            },
          });
          return response.data;
        },
      });
    },

    // Optimistic updates for transactions
    optimisticallyUpdateTransaction: (
      txhash: string,
      updates: Partial<Transaction>
    ) => {
      apiService.optimisticUpdate<Transaction[]>(
        ['transactions'],
        (oldData) => {
          if (!oldData) return oldData || [];
          return oldData.map((tx) =>
            tx.hash === txhash ? { ...tx, ...updates } : tx
          );
        }
      );
    },
  };
}

// Export individual hooks for convenience
// export {
//   useAccountService,
//   useTransactionService,
//   useBlockService,
//   useTokenService,
//   useGasService,
//   useStatsService,
//   useContractService,
// };
