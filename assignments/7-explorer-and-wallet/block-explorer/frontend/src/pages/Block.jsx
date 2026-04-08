import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlockById } from '../api/explorer';

export default function Block() {
  const { id } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    getBlockById(id).then(setBlock);
  }, [id]);

  if (!block) {
    return (
      <div className="p-6 animate-pulse text-zinc-500">
        Loading block details…
      </div>
    );
  }

  const timeAgo = (timestamp) => {
    const s = Math.floor(Date.now() / 1000) - timestamp;
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)} mins ago`;
    return `${Math.floor(s / 3600)} hrs ago`;
  };

  const formatNumber = (n) => new Intl.NumberFormat().format(n);

  const shorten = (str) => `${str.slice(0, 10)}...${str.slice(-8)}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Block #{block.number}</h1>
          <p className="text-sm text-zinc-400">
            {timeAgo(block.timestamp)} •{' '}
            {formatNumber(block.transactions.length)} transactions
          </p>
        </div>
      </div>

      {/* Info Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
        <Row label="Block Height" value={block.number} />
        <Row
          label="Timestamp"
          value={new Date(block.timestamp * 1000).toUTCString()}
        />
        <Row label="Block Hash" value={block.hash} mono />
        <Row label="Parent Hash" value={block.parentHash} mono />
        <Row label="Miner" value={block.miner} mono />
        <Row label="Transactions" value={block.transactions.length} />
        {/* <Row label="Block Reward" value={`${block.reward} ETH`} highlight /> */}
        <Row
          label="Gas Used"
          value={`${formatNumber(block.gasUsed)} (${((block.gasUsed / block.gasLimit) * 100).toFixed(2)}%)`}
        />
        <Row label="Gas Limit" value={formatNumber(block.gasLimit)} />
        <Row label="Base Fee" value={`${block.baseFeePerGas} Gwei`} />
        {/* <Row label="Block Size" value={`${formatNumber(block.size)} bytes`} /> */}
        <Row label="Nonce" value={block.nonce} />
      </div>
    </div>
  );
}

/* ---------- Row Component ---------- */

function Row({ label, value, mono, highlight }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-6 py-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p
        className={`md:col-span-2 text-sm break-all ${
          mono ? 'font-mono' : ''
        } ${highlight ? 'text-emerald-400 font-semibold' : 'text-zinc-200'}`}
      >
        {value}
      </p>
    </div>
  );
}
