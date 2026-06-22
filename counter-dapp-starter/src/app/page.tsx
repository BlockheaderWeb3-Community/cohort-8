"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Mock functions for wallet and counter
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 800);
  };

  const handleGetCount = async () => {
    // dummy
  };

  const handleIncrease = async () => {
    if (!isConnected) return;
    setCount((prev) => prev + 1);
  };

  const handleDecrease = async () => {
    if (!isConnected) return;
    setCount((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 transition-all duration-300">
        <div className="text-xl font-medium tracking-tighter flex items-center gap-2 select-none">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          COUNTER
        </div>
        <button
          onClick={handleConnectWallet}
          disabled={isConnected || isConnecting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 border
            ${
              isConnected
                ? "bg-white text-black border-transparent cursor-default"
                : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white hover:text-black active:scale-95 cursor-pointer"
            }
          `}
        >
          {isConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Connected
            </>
          ) : isConnecting ? (
            <span className="animate-pulse">Connecting...</span>
          ) : (
            <>
              <Wallet size={16} />
              Connect Wallet
            </>
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/2 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 w-full transition-all duration-700 ease-out transform translate-y-0 opacity-100">
          {/* Current count display */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium tracking-[0.2em] text-white/40 uppercase">
              Current Count
            </span>
            <div className="text-[12rem] leading-none font-medium tracking-tighter text-white transition-all duration-500">
              {count}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-xl">
            <button
              onClick={handleGetCount}
              className="group relative w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 rounded-2xl hover:border-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 font-medium tracking-wide">
                Get Count
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="absolute inset-0 z-20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wide">
                Get Count
              </span>
            </button>

            <button
              onClick={handleIncrease}
              disabled={!isConnected}
              className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black border border-transparent rounded-2xl hover:bg-transparent hover:text-white hover:border-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black disabled:hover:border-transparent overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 font-medium tracking-wide">
                Increase Count
              </span>
            </button>

            <button
              onClick={handleDecrease}
              disabled={!isConnected || count === 0}
              className="group relative w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 rounded-2xl hover:border-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 font-medium tracking-wide">
                Decrease Count
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="absolute inset-0 z-20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wide">
                Decrease Count
              </span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full p-6 text-center text-xs text-white/30 font-medium tracking-wider uppercase">
        Built with Next.js and Solidity
      </footer>
    </div>
  );
}
