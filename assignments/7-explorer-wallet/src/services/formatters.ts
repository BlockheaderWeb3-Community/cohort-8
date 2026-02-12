import { formatDistanceToNow } from 'date-fns';

export function shortenHash(hash: string, chars: number = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function weiToEth(wei: string): string {
  const bn = BigInt(wei);
  const eth = bn / 1_000_000_000_000_000_000n;
  const decimals = (bn % 1_000_000_000_000_000_000n)
    .toString()
    .padStart(18, '0')
    .slice(0, 4);
  return `${eth}.${decimals}`;
}

export function weiToGwei(wei: string) {
  return parseInt(wei, 16) / 1e9;
}

export function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

export function formatTimestamp(timestamp: string): string {
  const ts = hexToNumber(timestamp) * 1000;
  return formatDistanceToNow(new Date(ts), { addSuffix: true });
}
