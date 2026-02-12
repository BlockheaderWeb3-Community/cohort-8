export default function Footer() {
  return (
    <footer className="p-4 mt-8 bg-sepolia-darker">
      <div className="container mx-auto text-center text-gray-500">
        © {new Date().getFullYear()} Sepolia Explorer. Powered by Ethereum
        JSON-RPC.
      </div>
    </footer>
  );
};


