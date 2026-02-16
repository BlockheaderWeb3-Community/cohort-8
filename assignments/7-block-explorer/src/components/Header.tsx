import Link from 'next/link';

export function Header() {
  return (
    <header className="shadow bg-background/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold p-5">Etherscan</div>
            {/* <nav className="ml-10 space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link
                href="/blocks"
                className="text-gray-700 hover:text-blue-600"
              >
                Blockchain
              </Link>
              <Link
                href="/transactions"
                className="text-gray-700 hover:text-blue-600"
              >
                Transactions
              </Link>
              <Link
                href="/tokens"
                className="text-gray-700 hover:text-blue-600"
              >
                Tokens
              </Link>
            </nav> */}
          </div>
          {/* <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by Address / Txn Hash / Block / Token / Domain"
              className="px-4 py-2 border rounded-lg w-96"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Connect Wallet
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
}
