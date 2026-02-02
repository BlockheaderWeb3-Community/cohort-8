'use client';

import { useEtherscanService } from '@/lib/useEtherscanService';
import { EthereumStatsCard } from './EthereumStatsCard';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { ApiError } from '@/lib/api/config';

interface AccountDashboardProps {
  address: string;
}

export default function AccountDashboard({ address }: AccountDashboardProps) {
  const etherscan = useEtherscanService();

  // Use account balance query
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = etherscan.account.useAccountBalance(address);

  // Use infinite query for transactions
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = etherscan.account.useAccountTransactions(address);

  // Use token transfers
  const { data: tokenTransfersData, isLoading: tokenTransfersLoading } =
    etherscan.account.useTokenTransfers(address);

  // Handle errors
  if (balanceError instanceof ApiError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading account data: {balanceError.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account balance card */}
      <EthereumStatsCard
        title="Account Balance"
        value={
          balanceLoading
            ? '...'
            : `${parseFloat(balanceData?.result || '0') / 1e18} ETH`
        }
        subtitle={address.substring(0, 10) + '...'}
      />

      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>

        <div className="divide-y">
          {transactionsLoading ? (
            <div className="p-6">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : (
            transactionsData?.pages
              .flatMap((page) => page.result)
              .map((tx, index) => (
                <div key={tx.hash} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <a
                        href={`/tx/${tx.hash}`}
                        className="text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center"
                      >
                        {tx.hash.substring(0, 20)}...
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                      <div className="text-sm text-gray-500 mt-1">
                        From: {tx.from.substring(0, 12)}... → To:{' '}
                        {tx.to?.substring(0, 12) || 'Contract Creation'}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {(parseInt(tx.value) / 1e18).toFixed(4)} ETH
                      </div>
                      <div className="text-sm text-gray-500">
                        Block #{tx.blockNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Load more button */}
        {hasNextPage && (
          <div className="p-4 border-t">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Load More Transactions'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
