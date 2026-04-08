import { Link } from 'react-router';

const Header: React.FC = () => {
  return (
    <>
      <header className="relative backdrop-blur-md py-2 border-b dark:border-gray-900">
        <div className="flex items-center w-full h-16 justify-between w-full max-w-7xl mx-auto gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <img
              src="/Full-logo.png"
              alt="Sepolia Wallet Logo"
              className="object-cover h-12"
            />
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/blocks">Blocks</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/wallet">Wallet</Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
