import type { Route } from '../+types/root';
import BlockDetailPage from '../blocks/BlockDetailPage';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Block ${params.blockNumber}` },
    { name: 'description', content: `Details for block ${params.blockNumber}` },
  ];
}

export default function BlockDetailRoute() {
  return <BlockDetailPage />;
}
