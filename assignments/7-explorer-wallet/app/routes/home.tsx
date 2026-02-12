import type { Route } from './+types/home';
import HomePage from '../home/HomePage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Block Explorer and Wallet' },
    { name: 'description', content: 'Ethereum dashboard' },
  ];
}

export default function HomeRoute() {
  return <HomePage />;
}
