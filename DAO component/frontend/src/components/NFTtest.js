const axios = require("axios");

// Function to fetch JSON data from the provided IPFS link
async function fetchJsonFromIpfs(ipfsLink) {
  try {
    const hash = ipfsLink.replace("ipfs://", "");
    const baseIpfsLink = "https://ipfs.io/ipfs/";
    const ipfsLink2 = baseIpfsLink + hash;

    const response = await axios.get(ipfsLink2);
    return response.data;
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    return null;
  }
}

const tokenuri =
  "ipfs://bafkreicizfavgirgjzyoyzgsxtzzuomgsrabrdfa4kuini2srdk2ajj44e";

fetchJsonFromIpfs(tokenuri)
  .then((jsonData) => {
    if (jsonData) {
      // Extract the hash from the "image" field
      const hash = jsonData.image.replace("ipfs://", "");
      let imageurl = "https://ipfs.io/ipfs/" + hash;
      console.log(imageurl);
      return imageurl;
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
