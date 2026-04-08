import type { Route } from './+types/home';
import BlocksPage from '../blocks/BlocksPage';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Blocks' },
    { name: 'description', content: 'Latest Ethereum blocks' },
  ];
}

export default function BlocksRoute() {
  return <BlocksPage />;
}
