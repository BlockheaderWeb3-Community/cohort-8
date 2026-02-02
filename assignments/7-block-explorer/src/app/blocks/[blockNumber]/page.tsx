'use client';

import { Loader2 } from 'lucide-react';
import useBlockDetails from '@/lib/useBlockDetails';
import { hexToDecimal } from '@/lib/utils';

export default function BlockDetailPage() {
  const {
    blockDetails,
    isFetchingBlockByNumber,
    blockNumber,
    finalizedBlockNumber,
  } = useBlockDetails();

  console.log('Block Details:', blockDetails);

  if (isFetchingBlockByNumber) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const baseFeePerGasInEth = (baseFeePerGas: any) => {
    const baseFeeInEth = hexToDecimal(baseFeePerGas) / 1e18;
    return baseFeeInEth.toFixed(18) + ' ETH';
  };

  const baseFeePerGasInGwei = (baseFeePerGas: any) => {
    const RewardInGwei = hexToDecimal(baseFeePerGas) / 1e9;
    return RewardInGwei.toFixed(18) + ' in Gwei';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Block #{blockNumber}</h1>
      {/* Block details UI */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Block Height:</p>
          <p className="flex-2">{hexToDecimal(blockDetails?.number)}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Timestamp:</p>
          <p className="flex-2">
            {' '}
            {new Date(
              hexToDecimal(blockDetails?.timestamp) * 1000
            ).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Status:</p>
          <p className="flex-2">
            {hexToDecimal(blockDetails?.number) < finalizedBlockNumber
              ? 'finalized'
              : 'Unfinalized'}
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Total difficulty:</p>
          <p className="flex-2">{hexToDecimal(blockDetails?.difficulty)}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Withdrawals:</p>
          <p className="flex-2">
            {blockDetails?.withdrawals?.length} withdrawals in this block
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Fee recipient:</p>
          <p className="flex-2">{blockDetails?.miner}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Size:</p>
          <p className="flex-2">
            {hexToDecimal(blockDetails?.size)?.toLocaleString()} bytes
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Gas Used:</p>
          <p className="flex-2">
            {hexToDecimal(blockDetails?.gasUsed)?.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Gas Limit:</p>
          <p className="flex-2">
            {hexToDecimal(blockDetails?.gasLimit)?.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Base Fee Per Gas:</p>
          <p className="flex-2">
            {baseFeePerGasInEth(hexToDecimal(blockDetails?.baseFeePerGas))} (
            {baseFeePerGasInGwei(hexToDecimal(blockDetails?.baseFeePerGas))})
          </p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Hash:</p>
          <p className="flex-2">{blockDetails?.hash}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Parent Hash:</p>
          <p className="flex-2">{blockDetails?.parentHash}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">State Root:</p>
          <p className="flex-2">{blockDetails?.stateRoot}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Withdrawals Hash:</p>
          <p className="flex-2">{blockDetails?.withdrawalsRoot}</p>
        </div>
        <div className="flex flex-row items-center gap-6">
          <p className="flex-1">Nonce:</p>
          <p className="flex-2">{blockDetails?.nonce}</p>
        </div>
      </div>
    </div>
  );
}
