/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { hexToDecimal } from '@/lib/utils';
import { ExternalLink, Clock, Droplets } from 'lucide-react';

interface TransactionListProps {
  transactions: any;
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-secondary rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        {/* <thead className="bg-secondary py-4">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-abstract/80 uppercase tracking-wider">
              Transaction Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-abstract/80 uppercase tracking-wider">
              From / To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-abstract/80 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-abstract/80 uppercase tracking-wider">
              Gas Price
            </th>
          </tr>
        </thead> */}
        <tbody className="bg-secondary divide-y divide-gray-200">
          {transactions.map((tx: any) => (
            <tr key={tx.hash} className="hover:bg-tertiary/20 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <p
                    // href={`/tx/${tx.hash}`}
                    className="text-abstract hover:text-abstract/90 font-mono text-xs flex items-center"
                  >
                    {tx.hash.substring(0, 20)}...
                    {/* <ExternalLink className="w-4 h-4 ml-1" /> */}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="text-abstract/80">From:</span>{' '}
                    <span className="font-mono">
                      {tx.from.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-abstract/80">To:</span>{' '}
                    <span className="font-mono">
                      {tx.to.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-xs font-semibold">
                  {hexToDecimal(tx.value) / 1e18} ETH
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-abstract/80 text-xs">
                  <Droplets className="w-4 h-4 mr-2" />
                  {hexToDecimal(tx.gasPrice) / 1e9} Gwei
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
