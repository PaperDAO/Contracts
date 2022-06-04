// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Whitepaper is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, EIP712, ERC721Votes {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    //Default URI
    string uri = "";
    mapping(uint256 => bool) internal _notEmpty;        // YOLO

    //Token Text (Arrayof 74 rows)
    // mapping(uint256 => string) internal _tokenText;        // Mapping for Case Contracts
    mapping(uint256 => string[75]) internal _tokenText;        // Mapping for Case Contracts

    constructor() ERC721("WhitePaper", "WP") EIP712("WhitePaper", "1.0") {

    }

    function price(uint256 _tokenId) public view returns (uint256) {
        
    }

    function typewrite(uint256 tokenId, string[75] memory _text) external {
        //Validate
        require(_msgSender() == ownerOf(tokenId), "Only the owner can call this function");
        //Singe Write for each token
        // require(keccak256(abi.encodePacked(_tokenText[tokenId])) == keccak256(abi.encodePacked("")), "Paper Already Written");
        require(!_notEmpty[tokenId], "Paper Already Written");
        //Save
        _tokenText[tokenId] = _text;
    }

    function mint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        // _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}