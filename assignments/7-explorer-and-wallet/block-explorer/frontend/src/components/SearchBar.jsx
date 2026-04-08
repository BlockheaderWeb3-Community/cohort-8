import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.length > 20) navigate(`/tx/${query}`);
    else navigate(`/block/${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl">
      <input
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none border border-zinc-800 focus:border-indigo-500"
        placeholder="Search block number / hash / txn hash"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </form>
  );
}