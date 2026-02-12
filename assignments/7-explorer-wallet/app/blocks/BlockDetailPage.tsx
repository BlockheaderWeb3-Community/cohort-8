import { useParams, Link } from 'react-router';
import { useBlock } from '../../src/hooks/useSepolia';
import {
  shortenHash,
  formatTimestamp,
  hexToNumber,
  weiToEth,
} from '../../src/services/formatters';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorMessage from '../../src/components/ui/ErrorMessage';
import type { RpcTransaction } from '../../src/types/types';

export default function BlockDetailPage() {
  const { blockNumber } = useParams<Record<string, string>>();
  const num = blockNumber ? parseInt(blockNumber, 10) : 0;
  const { data, isLoading, error } = useBlock(num);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return <ErrorMessage message="Block not found" />;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">
        Block #{hexToNumber(data.number)}
      </h1>
      <div className="p-4 mb-4 rounded-lg bg-sepolia-dark">
        <p>
          <strong>Hash:</strong> {data.hash}
        </p>
        <p>
          <strong>Parent Hash:</strong> {data.parentHash}
        </p>
        <p>
          <strong>Timestamp:</strong> {formatTimestamp(data.timestamp)}
        </p>
        <p>
          <strong>Miner:</strong> {shortenHash(data.miner)}
        </p>
        <p>
          <strong>Gas Used / Limit:</strong> {weiToEth(data.gasUsed)} /{' '}
          {weiToEth(data.gasLimit)}
        </p>
      </div>
      <h2 className="mb-2 text-lg font-bold">Transactions</h2>
      <table className="w-full text-sm rounded-lg bg-sepolia-dark">
        <tbody>
          {(data.transactions as RpcTransaction[]).map((tx: RpcTransaction) => (
            <tr key={tx.hash} className="border-b border-gray-700">
              <td className="px-4 py-2">
                <Link to={`/tx/${tx.hash}`} className="text-sepolia-blue">
                  {shortenHash(tx.hash)}
                </Link>
              </td>
              <td className="px-4 py-2">From: {shortenHash(tx.from)}</td>
              <td className="px-4 py-2">
                To: {tx.to ? shortenHash(tx.to) : 'Contract'}
              </td>
              <td className="px-4 py-2">{weiToEth(tx.value)} ETH</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
