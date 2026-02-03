import { useState, useEffect, JSX } from 'react';
import { FaFileContract } from 'react-icons/fa';
import axios from 'axios';
import { getBlockByNumber } from '../utils/jsonrpc';

interface Transaction {
  id: number;
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  time: string;
  icon: JSX.Element;
}

export const LatestTransactions = () => {
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestTransactions = async () => {
    try {
      setLoading(true);

      
      const blockNumberRes = await axios.post(
        'https://ethereum-rpc.publicnode.com',
        {
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }
      );

      const latestBlockHex = blockNumberRes.data.result;
      const latestBlock = parseInt(latestBlockHex, 16);

      
      const blockRequests = Array.from({ length: 19 }, (_, i) => {
        const hex = '0x' + (latestBlock - i).toString(16);
        return getBlockByNumber(hex, true, i + 1);
      });

      const blockResponses = await Promise.all(blockRequests);

      
      let txs: Transaction[] = [];
      let idCounter = 0;

      blockResponses.forEach((res: any) => {
        const block = res?.data?.result;
        if (!block?.transactions) return;

        const timestamp = parseInt(block.timestamp, 16);

        block.transactions.forEach((tx: any) => {
          const valueWei = BigInt(tx.value);
          const valueEth = Number(valueWei) / 1e18;

          txs.push({
            id: idCounter++,
            hash: tx.hash,
            from: tx.from,
            to: tx.to ?? 'Contract Creation',
            value: `${valueEth.toFixed(4)} ETH`,
            blockNumber: parseInt(block.number, 16),
            timestamp,
            time: getTimeAgo(timestamp),
            icon: <FaFileContract className="text-green-500 w-6 h-6" />,
          });
        });
      });

      
      txs.sort((a, b) => b.timestamp - a.timestamp);

      
      setLatestTransactions(txs.slice(0, 15));
    } catch (err) {
      console.error('Failed to fetch latest transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Math.floor(Date.now() / 1000) - timestamp;
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const formatAddress = (addr: string) =>
    addr === 'Contract Creation'
      ? addr
      : `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  useEffect(() => {
    fetchLatestTransactions();
    
    
  }, []);

  if (loading) {
    return <div className="p-4">Loading latest transactions…</div>;
  }

  return (
    <div >
      <div className="font-bold text-gray-500 mb-4">Latest Transactions</div>

      {latestTransactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center gap-4 p-3 border-b border-green-700/20 hover:bg-green-50"
        >
          {tx.icon}

          <div className="flex-1 min-w-0">
            <div className="text-green-700 font-semibold truncate">
              {formatAddress(tx.hash)}
            </div>
            <div className="text-xs text-gray-400">{tx.time}</div>
          </div>

          <div className="flex-1 min-w-0 text-sm">
            <div className="truncate">From: {formatAddress(tx.from)}</div>
            <div className="truncate">To: {formatAddress(tx.to)}</div>
          </div>

          <div className="text-sm font-medium">{tx.value}</div>
        </div>
      ))}
    </div>
  );
};
