import { Link } from "react-router-dom";

export default function TxnCard({ txn }) {
  return (
    <Link
      to={`/tx/${txn.hash}`}
      className="block rounded-xl bg-zinc-900 p-4 border border-zinc-800 hover:border-indigo-500"
    >
      <p className="text-sm truncate">{txn.hash}</p>
    </Link>
  );
}