import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 px-6 py-4">
      <Link to="/" className="text-xl font-bold tracking-wide">
         JSONScan
      </Link>
    </nav>
  );
}