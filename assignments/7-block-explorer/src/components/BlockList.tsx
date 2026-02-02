/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { hexToDecimal } from '@/lib/utils';
import { Box, Clock, Droplets } from 'lucide-react';

interface BlockListProps {
  blocks: any;
}

export function BlockList({ blocks }: BlockListProps) {
  console.log('Blocks in BlockList:', blocks);

  const blockReward = (block: any) => {
    const RewardInGwei =
      hexToDecimal(block?.baseFeePerGas) * hexToDecimal(block?.gasUsed);
    const rewardInEth = RewardInGwei / 1e18;
    return rewardInEth.toFixed(10) + ' ETH';
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {blocks?.map((bl: any) => (
            <tr key={bl.hash} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row gap-4 items-center">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Box />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <a
                      href={`/blocks/${hexToDecimal(bl.number)}`}
                      className="text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center"
                    >
                      {hexToDecimal(bl.number)}
                    </a>
                    <p>{hexToDecimal(bl.timestamp)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                  <div className="space-y-1">
                    <span className="text-gray-500">Miner:</span> {bl.miner}
                  </div>
                  <p>
                    <span className="text-gray-500">
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
