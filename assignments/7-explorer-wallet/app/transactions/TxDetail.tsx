import { useParams, Link } from 'react-router';
import { useTransaction } from '../../src/hooks/useSepolia';
import {
  shortenHash,
  weiToGwei,
  weiToEth,
  hexToNumber,
} from '~/src/services/formatters';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorMessage from '../../src/components/ui/ErrorMessage';

export default function TxDetail() {
  const { txHash } = useParams<{ txHash?: string }>();
  const { data, isLoading, error } = useTransaction(txHash || '');

  const tx = data?.tx;
  const receipt = data?.receipt;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!tx) return <ErrorMessage message="Transaction not found" />;

  const status = receipt
    ? hexToNumber(receipt.status) === 1
      ? 'Success'
      : 'Failed'
    : 'Pending';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Transaction {shortenHash(tx.hash)}
      </h1>
      <div className="bg-sepolia-dark p-4 rounded-lg">
        <p>
          <strong>Block:</strong>{' '}
          <Link
            to={`/block/${hexToNumber(tx.blockNumber)}`}
            className="text-sepolia-blue"
          >
            {hexToNumber(tx.blockNumber)}
          </Link>
        </p>
        <p>
          <strong>From:</strong> {shortenHash(tx.from)}
        </p>
        <p>
          <strong>To:</strong>{' '}
          {tx.to ? shortenHash(tx.to) : 'Contract Creation'}
        </p>
        <p>
          <strong>Value:</strong> {weiToEth(tx.value)} ETH
        </p>
        <p>
          <strong>Gas Price:</strong> {weiToGwei(tx.gasPrice)} Gwei
        </p>
        <p>
          <strong>Input Data:</strong>{' '}
          <code className="break-all">{tx.input}</code>
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  );
}
