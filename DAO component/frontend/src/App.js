import Header from "./components/Header";
import { Treasury } from "./components/Treasury.js";
import { Member } from "./components/Member.js";
import { Contact } from "./components/AILLM.js";

import { Governance } from "./components/Governance";
import { Llmvision } from "./components/AIVISION.js";
import { Buildingcontrol } from "./components/AIAGENT.js";

import { Home } from "./components/Home";
import { useMetamaskState } from "./web3/ConnectWallet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useGetValue } from "./web3/GetCurrentValue";
import { useGetBalance } from "./web3/GetTokenBalance";
import { useRequestFunds } from "./web3/GetFunds";
import { useCreateProposal } from "./web3/NewProposal";
import { X } from "./components/Test";
import { User } from "./components/User";
import { DigitalTwin } from "./components/DigitalTwin";
import "./App.css";

function App() {
  const { boxValue, getValue } = useGetValue();
  const { isConnected, account, signer, connectToMetamask } =
    useMetamaskState();
  const { userBalance, getBalance } = useGetBalance();
  const { requestFunds } = useRequestFunds();
  const {
    createProposal,
    proposal,
    newValue,
    proposalDescription,
    createProposalsendtoken,
    createProposalsendEther,
    createProposalremovemember,
    createProposaladdmember,
    createProposalmintnft,
  } = useCreateProposal();

  return (
    <>
      <Router>
        <Header
          isConnected={isConnected}
          connectToMetamask={connectToMetamask}
        />

        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route
              path="/governance"
              element={
                <Governance
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  createProposalsendtoken={createProposalsendtoken}
                  createProposalsendEther={createProposalsendEther}
                  createProposalremovemember={createProposalremovemember}
                  createProposaladdmember={createProposaladdmember}
                  createProposalmintnft={createProposalmintnft}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route
              path="/user"
              element={
                <User
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route
              path="/digitaltwin"
              element={
                <DigitalTwin
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route
              path="/test"
              element={
                <X
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route path="/treasury" element={<Treasury />} />
            <Route path="/member" element={<Member />} />
            <Route
              path="/aillm"
              element={
                <Contact
                  boxValue={boxValue}
                  getValue={getValue}
                  userBalance={userBalance}
                  getBalance={getBalance}
                  signer={signer}
                  requestFunds={requestFunds}
                  createProposal={createProposal}
                  proposal={proposal}
                  newValue={newValue}
                  proposalDescription={proposalDescription}
                />
              }
            />
            <Route path="/buildingcontrol" element={<Buildingcontrol />} />{" "}
            <Route path="/llmvision" element={<Llmvision />} />
          </Routes>
        </div>
      </Router>

      {/* <Footer /> */}
    </>
  );
}

export default App;
