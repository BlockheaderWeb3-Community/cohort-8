import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Block from "./pages/Block";
import Transaction from "./pages/Transaction";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:id" element={<Block />} />
          <Route path="/tx/:hash" element={<Transaction />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}