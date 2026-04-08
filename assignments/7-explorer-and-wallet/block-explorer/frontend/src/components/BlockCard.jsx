import { Link } from 'react-router-dom';

export default function BlockCard({ block }) {
  const timeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000) - timestamp;

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };
  return (
    <Link
      to={`/block/${block.number}`}
      className="group rounded-xl bg-zinc-900 p-5 border border-zinc-800 
                 hover:border-indigo-500 transition space-y-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Block #{block.number}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
          {timeAgo(block.timestamp)}
        </span>
      </div>

      {/* Miner */}
      <div className="text-sm text-zinc-400">
        Miner
        <p className="text-zinc-200 truncate">{block.miner}</p>
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
        <div>
          <p className="text-zinc-500">Txns</p>
          <p className="font-medium text-zinc-200">
            {block.transactions?.length ?? 0}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">Reward</p>
          <p className="font-medium text-emerald-400">{block.reward} ETH</p>
        </div>
      </div>
    </Link>
  );
}
