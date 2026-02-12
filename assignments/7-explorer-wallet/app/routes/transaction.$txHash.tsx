import type { Route } from './+types/home';
import TxDetail from '../transactions/TxDetail';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Transaction ${params.txHash}` },
    {
      name: 'description',
      content: `Details for transaction ${params.txHash}`,
    },
  ];
}

export default function TxDetailRoute() {
  return <TxDetail />;
}
