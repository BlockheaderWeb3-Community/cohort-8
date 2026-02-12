import type { Route } from './+types/home';
import WalletPage from '../wallet/WalletPage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Wallet' },
    { name: 'description', content: 'Ethereum dashboard' },
  ];
}

export default function WalletRoute() {
  return <WalletPage />;
}
