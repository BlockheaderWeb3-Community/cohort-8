import { Link } from 'react-router';
import { useRecentBlocks } from '../../hooks/useSepolia';
import {
  shortenHash,
  formatTimestamp,
  hexToNumber,
} from '../../services/formatters';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { RpcBlock } from '../../types/types';

type Props = {
  limit?: number;
};

export default function LatestBlocks({ limit = 10 }: Props) {
  const { data, isLoading, error } = useRecentBlocks(limit);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold">Latest Blocks</h2>
      <div>
        <table className="w-full text-sm">
          <tbody>
            {data?.map((block: RpcBlock) => (
              <tr key={block.hash} className="border-b border-gray-700">
                <td className="py-2">
                  <Link
                    title={block.number}
                    to={`/block/${hexToNumber(block.number)}`}
                    className="text-sepolia-blue"
                  >
                    {hexToNumber(block.number)}
                  </Link>
                </td>
                <td title={block.timestamp}>
                  {formatTimestamp(block.timestamp)}
                </td>
                <td title={block.miner}>{shortenHash(block.miner)}</td>
                <td title="Block Transactions">
                  {(block.transactions as string[]).length} txns
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/blocks" className="text-sepolia-blue">
        Fetch Latest Block
      </Link>
    </div>
  );
}
