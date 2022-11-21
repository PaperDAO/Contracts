// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./abstract/Royalties.sol";

contract Paper1155 is 
    ERC1155, 
    Ownable, 
    Pausable, 
    ERC1155Burnable, 
    Royalties 
  {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    //Arbitrary Contract Name & Symbol 
    string public symbol = "PAPER";
    string public name = "Whitepaper";
    mapping(uint256 => address) public author;
    mapping(uint256 => string) public tokenURI;

    constructor(address treasury_, string memory uri) ERC1155(uri) {
        treasury = treasury_;
    }

    /// Set Treasury Address
    function setTreasury(address treasury_) external onlyOwner {
        treasury = treasury_;
    }

    /// Set Fee
    function setSecondaryFee(uint96 royaltyBPS_) external onlyOwner {
        royaltyBPS = royaltyBPS_;
    }

    /// Post a new paper
    function mint(address account, uint256 amount, string memory uri) public returns (uint256) {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(account, id, amount, "");
        _setTokenURI(id, uri);
        //Set Auotor
        author[id] = _msgSender();
        return id;
    }

    /// Create Copies of your paper
    function copy(address account, uint256 id, uint256 amount) public {
      require(_msgSender() == author[id], "Author Only");
      _mint(account, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    /// Set Action's Metadata URI
    function _setTokenURI(uint256 id, string memory uri) internal {
        tokenURI[id] = uri;
        emit URI(uri, id);
    }

    /// Update Contract URI
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

}

