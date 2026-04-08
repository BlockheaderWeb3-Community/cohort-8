import { Header } from '@/app/components/header'
import Overview from '@/app/components/overview'

type BlockTag = "latest" | "pending" | "finalized" | "safe" | string;

async function getBlockByNumber(
  blocknumber: BlockTag,
  fullTxObjects: boolean
) {
  const res = await fetch('https://ethereum-rpc.publicnode.com', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBlockByNumber",
      params: [blocknumber, fullTxObjects],
    }),
  });

  const response = await res.json();
  console.log('Fetched Block Data:', response);
  return response.result;
}

function toHexBlockNumber(decimal: string) {
  return "0x" + Number(decimal).toString(16);
}

const Blockpage = async ({ params }: { params: Promise<{ blocknumber: string }> }) => {
   const { blocknumber } = await params;
  console.log('Requested Block Number:', blocknumber);
  console.log('Type of Block Number:', typeof blocknumber);
  const hexBlockNumber = toHexBlockNumber(blocknumber);
  console.log('Hex Block Number:', hexBlockNumber);

  const block = await getBlockByNumber(hexBlockNumber, true);

  return (
    <div className="p-4">
      <Header />
      <div className="p-5">
        <Overview block={block} />
      </div>
    </div>
  );
};

export default Blockpage;
