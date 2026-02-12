import type { Route } from './+types/home';
import TransactionsPage from '../transactions/TransactionsPage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Transactions' },
    { name: 'description', content: 'Ethereum dashboard' },
  ];
}

export default function TransactionsRoute() {
  return <TransactionsPage />;
}
