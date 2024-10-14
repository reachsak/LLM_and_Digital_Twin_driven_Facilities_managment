import React, { useState } from "react";
import axios from "axios";

export const fetchJsonFromIpf = (ipfsLink) => {
  try {
    const hash = ipfsLink.replace("ipfs://", "");
    const baseIpfsLink = "https://ipfs.io/ipfs/";
    const ipfsLink2 = baseIpfsLink + hash;

    return axios.get(ipfsLink2).then((response) => response.data);
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    return Promise.reject(error);
  }
};
const fetchJsonFromIpfs = (ipfsLink) => {
  try {
    const hash = ipfsLink.replace("ipfs://", "");
    const baseIpfsLink = "https://ipfs.io/ipfs/";
    const ipfsLink2 = baseIpfsLink + hash;

    return axios.get(ipfsLink2).then((response) => response.data);
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    return Promise.reject(error);
  }
};

const Appp = () => {
  const [imageURL, setImageURL] = useState(null);

  const handleClick = () => {
    const tokenuri =
      "ipfs://bafkreicizfavgirgjzyoyzgsxtzzuomgsrabrdfa4kuini2srdk2ajj44e";

    fetchJsonFromIpfs(tokenuri)
      .then((jsonData) => {
        if (jsonData) {
          const hash = jsonData.image.replace("ipfs://", "");
          const imageUrl = "https://ipfs.io/ipfs/" + hash;
          setImageURL(imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <button onClick={handleClick}>Show Image</button>
      {imageURL && <img src={imageURL} alt="IPFS Image" />}
    </div>
  );
};

export default Appp;
