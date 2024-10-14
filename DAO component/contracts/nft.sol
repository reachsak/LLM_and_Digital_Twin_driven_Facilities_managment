// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721URIStorage, ERC721Burnable  {
    address[] public members;
    mapping(address => bool) public isMember;
    constructor()
        ERC721("BFHTOKENS", "BFHNFT")
        
    
    {members.push(msg.sender);
        isMember[msg.sender] = true;}

    function safeMint(address to, uint256 tokenId, string memory uri)
        public onlyMember

    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    modifier onlyMember() {
        require(isMember[msg.sender], "Only members can call this function");
        _;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    function addMember(address newMember) external onlyMember {
        require(!isMember[newMember], "Address is already a member");
        members.push(newMember);
        isMember[newMember] = true;
    }
    function removeMember(address member) external onlyMember {
        require(isMember[member], "Address is not a member");
        
        // Find the index of the member in the array
        uint256 index;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) {
                index = i;
                break;
            }
        }

        // Swap with the last element and then remove the last element to maintain order
        members[index] = members[members.length - 1];
        members.pop();
        isMember[member] = false;
    }
    function getMemberLength() external view returns (uint256) {
        return members.length;
    }
}