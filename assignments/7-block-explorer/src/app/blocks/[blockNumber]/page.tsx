/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Loader2 } from 'lucide-react';
import useBlockDetails from '@/lib/useBlockDetails';
import { hexToDecimal, timeAgo } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlockDetailPage() {
  const {
    blockDetails,
    isFetchingBlockByNumber,
    blockNumber,
    finalizedBlockNumber,
  } = useBlockDetails();

  const router = useRouter();

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
      <div className="flex flex-row gap-3">
        <ChevronLeft onClick={() => router.back()} className="cursor-pointer" />
        <h1 className="font-bold">Block #{blockNumber}</h1>
      </div>
      {/* Block details UI */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6">
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Block Height:</p>
            <p className="flex-2 text-xs">
              {hexToDecimal(blockDetails?.number)}
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Timestamp:</p>
            <p className="flex-2 text-xs">
              {' '}
              {timeAgo(hexToDecimal(blockDetails?.timestamp))}
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Status:</p>
            <div className="flex-2">
              <p
                className={`text-xs border border-solid w-fit p-1 rounded  ${
                  hexToDecimal(blockDetails?.number) < finalizedBlockNumber
                    ? 'text-green-500 border-green-500'
                    : 'text-red-500 border-red-500'
                } `}
              >
                {hexToDecimal(blockDetails?.number) < finalizedBlockNumber
                  ? 'Finalized'
                  : 'Unfinalized'}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Total difficulty:</p>
            <p className="flex-2 text-xs">
              {hexToDecimal(blockDetails?.difficulty)}
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Withdrawals:</p>
            <p className="flex-2 text-xs">
              {blockDetails?.withdrawals?.length} withdrawals in this block
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6">
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Fee recipient:</p>
            <p className="flex-2 text-xs">{blockDetails?.miner}</p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Size:</p>
            <p className="flex-2 text-xs">
              {hexToDecimal(blockDetails?.size)?.toLocaleString()} bytes
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Gas Used:</p>
            <p className="flex-2 text-xs">
              {hexToDecimal(blockDetails?.gasUsed)?.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Gas Limit:</p>
            <p className="flex-2 text-xs">
              {hexToDecimal(blockDetails?.gasLimit)?.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Base Fee Per Gas:</p>
            <p className="flex-2 text-xs">
              {baseFeePerGasInEth(hexToDecimal(blockDetails?.baseFeePerGas))} (
              {baseFeePerGasInGwei(hexToDecimal(blockDetails?.baseFeePerGas))})
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6">
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Hash:</p>
            <p className="flex-2 text-xs">{blockDetails?.hash}</p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Parent Hash:</p>
            <p className="flex-2 text-xs">{blockDetails?.parentHash}</p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">State Root:</p>
            <p className="flex-2 text-xs">{blockDetails?.stateRoot}</p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Withdrawals Hash:</p>
            <p className="flex-2 text-xs">{blockDetails?.withdrawalsRoot}</p>
          </div>
          <div className="flex flex-row items-center gap-6">
            <p className="flex-1 text-xs text-abstract/50">Nonce:</p>
            <p className="flex-2 text-xs">{blockDetails?.nonce}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
