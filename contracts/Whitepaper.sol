// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./base64.sol";
import "./abstract/IERC2981.sol";

contract Whitepaper is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    Ownable,
    EIP712,
    IERC2981,
    ERC721Votes
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public constant MAX_WHITE_PAPER_SUPPLY = 10000;
    // 3rd party royalties
    uint96 private constant _defaultRoyaltyBPS = 100; //1% royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    //Conf
    uint256 _confPriceStart = 0;
    uint256 _confPriceInterval = 1000;
    uint256 _confPriceStep = 1;

    uint256 _lastPrice;
    //Treasury Address
    address public treasury = 0x3b7a108fb52bC263d8fCB6C77dFF5b9B152C5f2c;

    /// URI Chnage Event
    event URI(string value, uint256 indexed tokenId);

    event PageContact(string[] pageContant, uint256 indexed tokenId);

    mapping(uint256 => bool) internal _notEmpty; // YOLO

    //Token Text (Array of 74 rows)
    // mapping(uint256 => string) internal _tokenText;        // Mapping for Case Contracts
    mapping(uint256 => string[]) internal _tokenText; // Mapping for Case Contracts

    constructor() ERC721("WhitePaper", "WP") EIP712("WhitePaper", "1.0") {}

    //Price for next Mint
    function mintPrice() public view returns (uint256) {
        uint256 nextTokenId = _tokenIdCounter.current() + 1;
        return price(nextTokenId);
    }

    /// Get Price for Token
    function price(uint256 _tokenId) public view returns (uint256) {
        uint256 curPrice = _confPriceStart + (_tokenId/_confPriceInterval * _confPriceStep);
        return curPrice;
    }

    //Get Token Text
    function getText(uint256 _tokenId) external view returns (string[] memory) {
        return _tokenText[_tokenId];
    }

    function typewrite(uint256 tokenId, string[] memory _text) external {
        //Validate
        require(
            _msgSender() == ownerOf(tokenId),
            "Only the owner can call this function"
        );
        //Single Write for each token
        require(!_notEmpty[tokenId], "Paper Already Written");
        //Save
        _tokenText[tokenId] = _text;
        //Mark
        _notEmpty[tokenId] = true;
        //Event
        emit PageContact(_text, tokenId);
        emit URI(tokenURI(tokenId), tokenId);
    }

    function mint(address to) public {
        require(
            MAX_WHITE_PAPER_SUPPLY > _tokenIdCounter.current(),
            "All papers was minted!"
        );
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        // _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        "testME",
                        '",',
                        '"image_data": "',
                        _createSvg(tokenId),
                        '"',
                        "}"
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _createSvg(uint256 tokenId) private view returns (bytes memory) {
        bytes memory svgText;
        bytes memory SVGPrefix;
        bytes memory SVGSuffix;
        bytes memory returnedSVG;
        SVGPrefix = "<svg width='2494' height='3523' viewBox='0 0 2494 3523' fill='none' xmlns='http://www.w3.org/2000/svg'> <g filter='url(#filter0_d_1815_20075)'> <path d='M0 0.5H2480V3508.5H184.642L0 3309.79V0.5Z' fill='white'/> <path d='M187.142 3309.79V3307.29H184.642H2.5V3H2477.5V3506H187.142V3309.79ZM182.142 3312.29V3502.14L5.73556 3312.29H182.142Z' stroke='#A3A1A1' stroke-width='5'/> </g> <defs> <filter id='filter0_d_1815_20075' x='0' y='0.5' width='2494' height='3522' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/> <feOffset dx='10' dy='10'/><feGaussianBlur stdDeviation='2'/> <feComposite in2='hardAlpha' operator='out'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/> <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1815_20075'/> <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1815_20075' result='shape'/> </filter></defs>";

        for (uint256 i = 0; i < _tokenText[tokenId].length; i++) {
            bytes memory tspan;
            tspan = abi.encodePacked(
                "<text x='200' y='",
                Strings.toString(250 + (100 * i)),
                "' font-family='Arial' font-size='53.3' fill='black'>"
            );
            string memory currentLine = _tokenText[tokenId][i];
            tspan = abi.encodePacked(tspan, currentLine, "</text>");
            svgText = abi.encodePacked(svgText, tspan);
        }
        SVGSuffix = "</svg>";

        returnedSVG = bytes(abi.encodePacked(SVGPrefix, svgText, SVGSuffix));

        return returnedSVG;
    }

    //-- Roylties (ERC2981)
    function checkRoyalties(address _contract) internal returns (bool) {
        bool success = IERC165(_contract).supportsInterface(
            _INTERFACE_ID_ERC2981
        );
        return success;
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        uint256 royaltyAmount = (_salePrice * _defaultRoyaltyBPS) / 10000;
        return (treasury, royaltyAmount);
    }
}
