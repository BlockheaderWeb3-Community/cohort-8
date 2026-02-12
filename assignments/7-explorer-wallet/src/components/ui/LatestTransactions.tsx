import { Link } from 'react-router';
import { useRecentTransactions } from '../../hooks/useSepolia';
import { shortenHash, weiToEth } from '../../services/formatters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { RpcTransaction } from '../../types/types';

type Props = {
  limit?: number;
};

export default function LatestTransactions({ limit = 10 }: Props) {
  const { data, isLoading, error } = useRecentTransactions(limit);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold">Latest Transactions</h2>
      <table className="w-full text-sm">
        <tbody>
          {data?.map((tx: RpcTransaction) => (
            <tr key={tx.hash} className="border-b border-gray-700">
              <td className="py-2" title={tx.hash}>
                <Link to={`/tx/${tx.hash}`} className="text-sepolia-blue">
                  {shortenHash(tx.hash)}
                </Link>
              </td>

              <td className="Sender" title={tx.from}>
                From: {shortenHash(tx.from)}
              </td>

              <td title={tx.to ?? 'Contract Creation'}>
                To: {tx.to ? shortenHash(tx.to) : 'Contract Creation'}
              </td>

              <td title="Block Reward">{weiToEth(tx.value)} ETH</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/transactions">Fetch Latest Transactions</Link>
    </div>
  );
}
