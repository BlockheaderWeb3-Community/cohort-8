import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format large numbers with abbreviations
export function formatNumber(num: number | string): string {
  const n =
    typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;

  if (n >= 1000000000) {
    return (n / 1000000000).toFixed(2) + 'B';
  }
  if (n >= 1000000) {
    return (n / 1000000).toFixed(2) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(2) + 'K';
  }
  return n.toString();
}

// Format gas price
export function formatGasPrice(gwei: number): string {
  if (gwei < 0.001) {
    return '< 0.001 Gwei';
  }
  return `${gwei.toFixed(3)} Gwei`;
}

export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}
