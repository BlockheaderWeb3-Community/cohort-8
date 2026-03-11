import { useEffect, useState } from 'react';
import {
  getLatestBlock,
  getRecentBlocks,
  getRecentTxns,
} from '../api/explorer';
import SearchBar from '../components/SearchBar';
import BlockCard from '../components/BlockCard';
import TxnCard from '../components/TxnCard';

export default function Home() {
  const [latest, setLatest] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    getLatestBlock()
      .then((d) => {
        console.log('LATEST:', d);
        setLatest(d);
      })
      .catch(console.error);

    getRecentBlocks()
      .then((d) => {
        console.log('BLOCKS:', d);
        setBlocks(d);
      })
      .catch(console.error);

    getRecentTxns()
      .then((d) => {
        console.log('TXNS:', d);
        setTxns(d);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="px-6 py-8 space-y-10">
      <SearchBar />

      {latest && (
        <div className="rounded-xl bg-zinc-900 p-6 border border-zinc-800">
          <h2 className="text-lg font-semibold">Latest Block</h2>
          <p className="text-sm text-zinc-400">#{latest.number}</p>
        </div>
      )}

      <section>
        <h3 className="mb-4 text-lg font-semibold">Recent Blocks</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((b) => (
            <BlockCard key={b.hash} block={b} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
        <div className="space-y-3">
          {txns.map((tx) => (
            <TxnCard key={tx.hash} txn={tx} />
          ))}
        </div>
      </section>
    </div>
  );
}
