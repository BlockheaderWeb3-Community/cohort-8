import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index('routes/home.tsx'),
  route('blocks', 'routes/blocks.tsx'),
  route('blocks/:blockByNumber', 'routes/block.$blockNumber.tsx'),
  route('transactions', 'routes/transactions.tsx'),
  route('transactions/txHash', 'routes/transaction.$txHash.tsx'),
  route('wallet', 'routes/wallet.tsx'),
] satisfies RouteConfig;
