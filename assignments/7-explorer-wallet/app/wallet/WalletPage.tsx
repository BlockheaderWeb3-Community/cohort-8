'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWallet } from '~/src/wallet/generateWallet';
export default function WalletPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [mnemonicVisible, setMnemonicVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  async function createWallet() {
    setLoading(true);

    const wallet = await generateWallet();

    setAddress(wallet.address);
    setMnemonic(wallet.mnemonic);

    setLoading(false);
  }

  return (
    <>
    {/* <div className={dark ? 'dark' : 'bg-green-700'}> */}
      <div className="w-full h-full">
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-zinc-300 dark:from-indigo-950 via-slate-300 dark:via-slate-950 to-white dark:to-black text-zinc-900 dark:text-slate-100 dark:text-slate-100 w-full h-full">
          {/* 🎥 Particle background */}
          <EntropyBackground />

          {/* 🌓 Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="absolute top-6 right-6 z-20 rounded-full bg-black/90 dark:bg-white/10 px-4 py-2 font-medium text-white text-xs backdrop-blur hover:bg-black/85 cursor-pointer dark:hover:bg-white/20"
          >
            {dark ? 'Light' : 'Dark'}
          </button>

          <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-6 w-full h-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                Cryptographic Wallet
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Generate a secure, deterministic Ethereum address.
              </p>

              {!address && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={createWallet}
                  disabled={loading}
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 py-3 text-sm font-semibold cursor-pointer text-black shadow-lg disabled:opacity-60"
                >
                  {loading ? 'Generating entropy…' : 'Create Wallet'}
                </motion.button>
              )}

              {/* 🪪 ENS-style address card */}
              <AnimatePresence>
                {address && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mt-8 rounded-2xl bg-black/40 p-5"
                  >
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      Wallet Address
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 font-mono text-sm">
                      <span className="truncate">{address}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="ml-4 text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Copy
                      </button>
                    </div>

                    {/* 🔑 Mnemonic reveal */}
                    <div className="mt-6">
                      <div className="mb-2 text-xs uppercase tracking-widest text-slate-400">
                        Recovery Phrase
                      </div>

                      <motion.div
                        onMouseDown={() => setMnemonicVisible(true)}
                        onMouseUp={() => setMnemonicVisible(false)}
                        onMouseLeave={() => setMnemonicVisible(false)}
                        className="cursor-pointer select-none rounded-xl bg-white/5 p-4"
                      >
                        <motion.p
                          animate={{
                            filter: mnemonicVisible
                              ? 'blur(0px)'
                              : 'blur(10px)',
                            opacity: mnemonicVisible ? 1 : 0.6,
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-sm font-mono leading-relaxed"
                        >
                          {mnemonic}
                        </motion.p>

                        <p className="mt-2 text-xs text-slate-500">
                          Hold to reveal
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    {/* </div> */}
    </>
  );
}

function EntropyBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {[...Array(40)].map((_, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: ['100vh', '-10vh'],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute h-1 w-1 rounded-full bg-indigo-400/30"
        />
      ))}
    </div>
  );
}
