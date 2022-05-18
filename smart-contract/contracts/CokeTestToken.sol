// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CokeTestToken is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    uint256 nftPrice = 0.1 ether;
    uint256 private _contractBalance;

    bytes32 public constant MINTER_ROLE = keccak256("WHITELISTED");
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Coke Test Token", "CTT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    fallback() external payable {}
    receive() external payable {}

    function safeMint(address to, string memory metadata) public payable onlyRole(MINTER_ROLE) {
        require(msg.value >= nftPrice, "Code:1");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadata);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

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
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
