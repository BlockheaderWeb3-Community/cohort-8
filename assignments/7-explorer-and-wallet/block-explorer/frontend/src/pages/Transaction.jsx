import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTxnByHash } from "../api/explorer";

export default function Transaction() {
  const { hash } = useParams();
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    getTxnByHash(hash).then(setTxn);
  }, [hash]);

  if (!txn) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Transaction</h1>
      <pre className="mt-4 bg-zinc-900 p-4 rounded-xl text-sm overflow-auto">
        {JSON.stringify(txn, null, 2)}
      </pre>
    </div>
  );
}