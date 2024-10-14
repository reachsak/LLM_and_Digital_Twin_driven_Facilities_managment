import React, { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import NFTABI from "../chain-info/contracts/MyTokennew.json";

const nftAddress = "0x723397FCbfFdF24f1E2B9F1B2bD8254eef2898c6";
const tokenId = 1;
const ownerAddress = "0xD760A17210b61900F696ad0C21a6e11dc8884198";

const MyComponent = () => {
  const [nftData, setNftData] = useState(null);

  const fetchNftData = async () => {
    try {
      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Connect to NFT contract
      const contract = new ethers.Contract(nftAddress, NFTABI.abi, provider);

      // Check NFT ownership
      const currentOwner = await contract.ownerOf(tokenId);
      if (currentOwner.toLowerCase() !== ownerAddress.toLowerCase()) {
        console.error("NFT is not owned by the provided address");
        return;
      }

      // Retrieve metadata from contract
      const nft = await contract.tokenOfOwnerByIndex(ownerAddress, tokenId);
      console.log(nft);
      const metadata = await contract.tokenMetadata(tokenId);

      // Set NFT data
      setNftData(metadata);
    } catch (error) {
      console.error("Error fetching NFT data:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchNftData}>Fetch NFT Data</button>
      {nftData ? (
        <div>
          <img src={nftData.image} alt={nftData.name} />
          <div>{nftData.name}</div>
          <div>{nftData.description}</div>
          {/* Render other metadata fields as needed */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MyComponent;
