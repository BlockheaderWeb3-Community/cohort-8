/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { hexToDecimal } from '@/lib/utils';
import { ExternalLink, Clock, Droplets } from 'lucide-react';

interface TransactionListProps {
  transactions: any;
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From / To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gas Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx: any) => (
            <tr key={tx.hash} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <a
                    href={`/tx/${tx.hash}`}
                    className="text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center"
                  >
                    {tx.hash.substring(0, 20)}...
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-gray-500">From:</span>{' '}
                    <span className="font-mono">
                      {tx.from.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">To:</span>{' '}
                    <span className="font-mono">
                      {tx.to.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-lg font-semibold">
                  {hexToDecimal(tx.value)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-gray-600">
                  <Droplets className="w-4 h-4 mr-2" />
                  {hexToDecimal(tx.gasPrice)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
