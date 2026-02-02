'use client';

import { BlockList } from '@/components/BlockList';
import { EthereumStatsCard } from '@/components/EthereumStatsCard';
import { StatsGrid } from '@/components/StatsGrid';
import { TransactionList } from '@/components/TransactionList';
import useTransaction from '@/lib/useTransaction';
import { useEthereumStats } from '@/lib/useEtherscanData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useEthereumStats();
  const {
    transactions,
    transactionsLoading,
    blocks,
    blocksLoading,
    finalizedBlockNumber,
    safeBlockNumber,
  } = useTransaction();

  console.log('Transactions on HomePage:', transactions);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ethereum (ETH) Blockchain Explorer
            </h1>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid
        finalizedBlockNumber={finalizedBlockNumber || 0}
        safeBlockNumber={safeBlockNumber || 0}
      />

      {/* Main Content */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Latest Blocks</h2>
          {blocksLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            <BlockList blocks={blocks || []} />
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            <TransactionList transactions={transactions || []} />
          )}
        </div>

        {/* <div>
          <h2 className="text-xl font-semibold mb-4">Latest Blocks</h2>
          <div className="space-y-4">
            {stats && (
              <>
                <EthereumStatsCard
                  title="Last Finalized Block"
                  value={stats.lastFinalizedBlock.toLocaleString()}
                  change="+1"
                  changeType="positive"
                />
                <EthereumStatsCard
                  title="Last Safe Block"
                  value={stats.lastSafeBlock.toLocaleString()}
                  change="+32"
                  changeType="positive"
                />
              </>
            )}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">
              Transaction History (14 days)
            </h3>
            <div className="h-48 flex items-end space-x-1">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  // style={{ height: `${30 + Math.random() * 70}%` }}
                />
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
