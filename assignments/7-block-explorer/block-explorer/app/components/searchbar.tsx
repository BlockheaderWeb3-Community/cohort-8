"use client";
import { useState } from "react";
import { obg } from "../utils/obj";

export const Searchbar = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(obg[0].name);

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative flex items-stretch h-12 rounded-xl shadow-lg border border-green-500/30">

        {/* Category dropdown */}
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center gap-2 px-4 text-sm font-medium text-green-500 bg-green-500/10 hover:bg-green-500/20 border-r border-green-500/30 rounded-l-xl"
        >
          {category}
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-neutral-900 border border-green-500/30 rounded-lg shadow-xl z-20">
            {obg.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.name);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-green-500/10"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {/* Search input */}
        <input
          type="search"
          placeholder="Search by Address / Txn Hash / Block"
          className="flex-1 px-5 text-sm bg-transparent text-green-200 placeholder-green-500/50 focus:outline-none"
        />

        {/* Search button */}
        <button
          type="submit"
          className="px-6 bg-green-500 text-black font-semibold hover:bg-green-400 transition rounded-r-xl"
        >
          Search
        </button>
      </div>
    </div>
  );
};
