// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PunnyPower
 * @dev Simple ERC20 token mintable by owner or a designated minter (Quest contract).
 */
contract PunnyPower is ERC20, Ownable {
    // address allowed to mint tokens (QuestRegistry for example)
    address public minter;

    constructor() ERC20("Punny Power", "PUNNY") {
        // initial supply intentionally left at 0
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    /**
     * @dev Mint tokens to `to`. Can be called by the owner or the configured minter.
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == owner() || msg.sender == minter, "PunnyPower: not authorized to mint");
        _mint(to, amount);
    }
}
