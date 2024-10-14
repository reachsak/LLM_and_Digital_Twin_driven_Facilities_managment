import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Navbar2 } from "./components/Navbar2";
import { useMetamaskState } from "./web3/ConnectWallet";

import { useEffect } from "react";
import { useGetValue } from "./web3/GetCurrentValue";
import { useGetBalance } from "./web3/GetTokenBalance";
import { useRequestFunds } from "./web3/GetFunds";
import { useCreateProposal } from "./web3/NewProposal";

import "./App.css";

function App2() {
  return (
    <>
      <Router>
        <NavBar />

        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App2;
