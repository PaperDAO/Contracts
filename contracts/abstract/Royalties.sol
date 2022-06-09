// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./IERC2981.sol";


/// Royalties
abstract contract Royalties is IERC2981 {
   // 3rd party royalties
    uint96 private constant _defaultRoyaltyBPS = 100; //1% royalties
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    address public treasury;


    //-- Roylties (ERC2981)
    function checkRoyalties(address _contract) internal view returns (bool) {
        bool success = IERC165(_contract).supportsInterface(
            _INTERFACE_ID_ERC2981
        );
        return success;
    }

    function royaltyInfo(uint256, uint256 salePrice_) external view override returns (address receiver, uint256 royaltyAmount) {
        uint256 royaltyAmount_ = (salePrice_ * _defaultRoyaltyBPS) / 10000;
        return (treasury, royaltyAmount_);
    }

}
