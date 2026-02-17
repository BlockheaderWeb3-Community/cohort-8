#!/usr/bin/env node
/**
 * One-off script: generates 8 EVM private keys for AI players.
 * Run: node scripts/generate-ai-keys.js
 * Copy the output into your .envaccounts (server-side only). Do not commit .env.
 */
import { generatePrivateKey } from "viem/accounts";
import { privateKeyToAccount } from "viem/accounts";

const pk = generatePrivateKey();
const account = privateKeyToAccount(pk);
console.log(`Private key: ${pk}`);
console.log(`Address : ${account.address}\n`);
