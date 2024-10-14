import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import NFTABI from "../chain-info/contracts/MyTokennew.json";
import contractAddress from "../chain-info/deployments/map.json";
const fetchJsonFromIpfs = async (ipfsLink) => {
  try {
    const hash = ipfsLink.replace("ipfs://", "");
    const baseIpfsLink = "https://ipfs.io/ipfs/";
    const ipfsLink2 = baseIpfsLink + hash;

    const response = await axios.get(ipfsLink2);
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    throw error;
  }
};
export const fetchJsonFromIpf = async (ipfsLink) => {
  try {
    const hash = ipfsLink.replace("ipfs://", "");
    const baseIpfsLink = "https://ipfs.io/ipfs/";
    const ipfsLink2 = baseIpfsLink + hash;

    const response = await axios.get(ipfsLink2);
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    throw error;
  }
};

const NFTComponent = (props) => {
  const { account } = props;
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const nftContractAddress = contractAddress["11155111"]["MyTokennew"][0];
        const nftContractInstance = new ethers.Contract(
          nftContractAddress,
          NFTABI.abi,
          provider
        );

        const totalSupply = await nftContractInstance.totalSupply();
        const urls = [];

        for (let i = 0; i < totalSupply; i++) {
          const tokenId = i;
          const owner = await nftContractInstance.ownerOf(tokenId);

          if (owner === account) {
            const tokenURI = await nftContractInstance.tokenURI(tokenId);
            const jsonData = await fetchJsonFromIpfs(tokenURI);

            if (jsonData && jsonData.image) {
              const hash = jsonData.image.replace("ipfs://", "");
              const imageUrl = "https://ipfs.io/ipfs/" + hash;
              urls.push(imageUrl);
            }
          }
        }

        setImageURLs(urls); // Update state after the loop
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
      }
    };

    fetchNFTMetadata();
  }, [account]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {imageURLs.map((url, index) => (
          <div
            key={index}
            style={{
              width: "100px", // Set the fixed width for each image container
              height: "100px", // Set the fixed height for each image container
              margin: "10px", // Add some margin between images
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={url}
              alt={`NFT Image ${index}`}
              style={{
                maxWidth: "100%", // Ensure image fits container width
                maxHeight: "100%", // Ensure image fits container height
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTComponent;
