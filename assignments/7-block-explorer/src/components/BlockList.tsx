/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { hexToDecimal, timeAgo } from '@/lib/utils';
import { Box, Clock, Droplets } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BlockListProps {
  blocks: any;
}

export function BlockList({ blocks }: BlockListProps) {
  console.log('Blocks in BlockList:', blocks);
  const router = useRouter();

  const handleGoToBlock = (blockNumber: number) => {
    router.push(`/blocks/${blockNumber}`);
  };

  const blockReward = (block: any) => {
    const RewardInGwei =
      hexToDecimal(block?.baseFeePerGas) * hexToDecimal(block?.gasUsed);
    const rewardInEth = RewardInGwei / 1e18;
    return rewardInEth.toFixed(10) + ' ETH';
  };

  return (
    <div className="bg-secondary rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-secondary divide-y divide-gray-200">
          {blocks?.map((bl: any) => (
            <tr key={bl.hash} className="hover:bg-tertiary/20 transition">
              <td className="px-6 py-4 whitespace-nowrap text-xs">
                <div className="flex flex-row gap-4 items-center">
                  <div className="bg-tertiary p-2 rounded-lg">
                    <Box className="text-abstract/80" />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p
                      onClick={() => handleGoToBlock(hexToDecimal(bl.number))}
                      className="cursor-pointer text-abstract hover:text-abstract/90 font-mono text-xs flex items-center"
                    >
                      {hexToDecimal(bl.number)}
                    </p>
                    <p>{timeAgo(hexToDecimal(bl.timestamp))}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-abstract/80">Miner:</span> {bl.miner}
                  </div>
                  <p>
                    <span className="text-abstract/80 text-xs">
                      {bl.transactions.length} txns
                    </span>{' '}
                    in 12 secs
                  </p>
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-lg font-semibold">{blockReward(bl)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-gray-600">
                  <Droplets className="w-4 h-4 mr-2" />
                  {bl.gasPrice}
                </div>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
