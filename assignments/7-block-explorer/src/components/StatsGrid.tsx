'use client';

import { useEthereumStats } from '@/lib/useEtherscanData';
import { Activity, Flame, Box, Zap } from 'lucide-react';

export function StatsGrid({
  finalizedBlockNumber,
  safeBlockNumber,
}: {
  finalizedBlockNumber: number;
  safeBlockNumber: number;
}) {
  const { data: stats, isLoading } = useEthereumStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 animate-pulse rounded-xl"
          ></div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Last Finalized Block',
      value: finalizedBlockNumber?.toLocaleString() || '0',
      subtitle: 'Finalized',
      icon: Box,
      color: 'bg-green-500',
    },
    {
      title: 'Last Safe Block',
      value: safeBlockNumber?.toLocaleString() || '0',
      subtitle: 'Safe',
      icon: Zap,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-secondary p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">{stat.title}</p>
              <p className="text-2xl font-bold mt-2 text-foreground">
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs mt-1">{stat.subtitle}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
