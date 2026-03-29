'use client';

import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Flame,
  Box as Cube,
  Shield,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChangeType = 'positive' | 'negative' | 'neutral';

export interface EthereumStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  change?: string;
  changeType?: ChangeType;
  loading?: boolean;
  className?: string;
  compact?: boolean;
  bordered?: boolean;
  onClick?: () => void;
  href?: string;
}

export function EthereumStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeType,
  loading = false,
  className,
  compact = false,
  bordered = true,
  onClick,
  href,
}: EthereumStatsCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const CardContent = () => (
    <div
      className={cn(
        'group transition-all duration-200',
        bordered && 'border border-gray-200',
        'rounded-lg',
        onClick || href
          ? 'cursor-pointer hover:shadow-md hover:border-gray-300'
          : '',
        compact ? 'p-4' : 'p-6',
        className
      )}
      onClick={onClick}
    >
      {/* Header with title and icon */}
      <div
        className={cn(
          'flex items-center justify-between mb-3',
          compact && 'mb-2'
        )}
      >
        <h3
          className={cn(
            'text-gray-600 font-medium',
            compact ? 'text-sm' : 'text-base'
          )}
        >
          {title}
        </h3>
        {Icon && (
          <div
            className={cn(
              'p-2 rounded-lg',
              compact ? 'p-1.5' : 'p-2',
              'bg-blue-50 text-blue-600'
            )}
          >
            <Icon
              className={cn(
                'transition-transform group-hover:scale-110',
                compact ? 'w-4 h-4' : 'w-5 h-5'
              )}
            />
          </div>
        )}
      </div>

      {/* Main value */}
      <div
        className={cn(
          'font-bold text-gray-900 mb-1',
          compact ? 'text-xl' : 'text-2xl'
        )}
      >
        {loading ? (
          <div
            className={cn(
              'bg-gray-200 animate-pulse rounded',
              compact ? 'h-7 w-24' : 'h-8 w-32'
            )}
          />
        ) : (
          value
        )}
      </div>

      {/* Subtitle and change */}
      <div className="flex items-center justify-between">
        {subtitle && (
          <span
            className={cn('text-gray-500', compact ? 'text-xs' : 'text-sm')}
          >
            {subtitle}
          </span>
        )}

        {change && (
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
              getChangeColor(),
              compact && 'px-1.5 py-0.5'
            )}
          >
            {getChangeIcon()}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Loading skeleton for subtitle/change area */}
      {loading && !subtitle && !change && (
        <div className="mt-2">
          <div
            className={cn(
              'bg-gray-200 animate-pulse rounded',
              compact ? 'h-4 w-20' : 'h-4 w-24'
            )}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}

// Specialized card variants
export function GasPriceCard({
  gwei,
  usd,
  loading,
}: {
  gwei: string;
  usd: string;
  loading?: boolean;
}) {
  return (
    <EthereumStatsCard
      title="Med Gas Price"
      value={loading ? '...' : `${gwei} Gwei`}
      subtitle={loading ? '' : usd}
      icon={Flame}
      bordered
      className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100"
    />
  );
}

export function BlockHeightCard({
  blockNumber,
  type = 'finalized',
  loading,
}: {
  blockNumber: number;
  type?: 'finalized' | 'safe' | 'latest';
  loading?: boolean;
}) {
  const getConfig = () => {
    switch (type) {
      case 'finalized':
        return {
          title: 'Last Finalized Block',
          icon: Cube,
          color: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-100',
        };
      case 'safe':
        return {
          title: 'Last Safe Block',
          icon: Shield,
          color: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-100',
        };
      default:
        return {
          title: 'Latest Block',
          icon: Cube,
          color: 'from-gray-50 to-blue-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getConfig();

  return (
    <EthereumStatsCard
      title={config.title}
      value={loading ? '...' : blockNumber.toLocaleString()}
      subtitle={
        loading
          ? ''
          : type === 'finalized'
          ? 'Finalized'
          : type === 'safe'
          ? 'Safe'
          : 'Latest'
      }
      icon={config.icon}
      bordered
      className={`bg-gradient-to-br ${config.color} ${config.borderColor}`}
    />
  );
}

export function EthPriceCard({
  price,
  change,
  loading,
}: {
  price: number;
  change: number;
  loading?: boolean;
}) {
  const isPositive = change >= 0;

  return (
    <EthereumStatsCard
      title="ETH Price"
      value={
        loading
          ? '...'
          : `$${price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
      }
      change={`${isPositive ? '+' : ''}${change.toFixed(2)}%`}
      changeType={isPositive ? 'positive' : 'negative'}
      icon={DollarSign}
      bordered
      className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100"
    />
  );
}

export function TransactionStatsCard({
  count,
  tps,
  loading,
}: {
  count: string;
  tps: number;
  loading?: boolean;
}) {
  return (
    <EthereumStatsCard
      title="Transactions"
      value={loading ? '...' : count}
      subtitle={loading ? '' : `${tps} TPS`}
      icon={Activity}
      bordered
      className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
    />
  );
}

// Compact variant for dashboard grids
export function CompactStatsCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: ChangeType;
  loading?: boolean;
}) {
  return (
    <EthereumStatsCard
      title={title}
      value={value}
      subtitle={subtitle}
      change={change}
      changeType={changeType}
      loading={loading}
      compact
      className="hover:bg-gray-50 transition-colors"
    />
  );
}

// Card with chart preview (like the 14-day transaction history)
export function ChartPreviewCard({
  title,
  value,
  data,
  loading,
}: {
  title: string;
  value: string;
  data: number[];
  loading?: boolean;
}) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-600 font-medium mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : value}
          </div>
        </div>
      </div>

      <div className="h-40">
        {loading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <div className="h-full flex items-end space-x-1">
            {data.map((value, index) => {
              const percentage =
                ((value - minValue) / (maxValue - minValue)) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:opacity-80"
                  style={{ height: `${percentage}%` }}
                  title={`Day ${index + 1}: ${value}`}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 text-xs text-gray-500">
        <span>14 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
