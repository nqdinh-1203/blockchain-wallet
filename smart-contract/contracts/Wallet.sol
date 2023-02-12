// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wallet {
    using SafeERC20 for IERC20;
    IERC20 public token;
    address payable public wallet;

    event SafeTransferFrom(address from, address to, uint256 amount);
    event SetToken(IERC20 tokenAddress);
    event SetWallet(address wallet);

    constructor(address payable _wallet, IERC20 walletToken) {
        wallet = _wallet;
        token = walletToken;
    }

    function setWallet(address payable _wallet) public {
        wallet = _wallet;
        emit SetWallet(_wallet);
    }

    function setToken(IERC20 tokenAddress) public {
        token = tokenAddress;
        emit SetToken(tokenAddress);
    }

    function transfer(address to, uint256 amount) external {
        require(
            token.balanceOf(msg.sender) >= amount,
            "Insufficient token in sender balance"
        );
        require(amount > 0, "Amount is zero");

        SafeERC20.safeTransferFrom(token, wallet, to, amount);
        emit SafeTransferFrom(wallet, to, amount);
    }

    // function withdraw() public {
    //     payable(wallet).transfer(address(this).balance);
    // }

    function withdrawERC20() public {
        token.transfer(wallet, token.balanceOf(address(this)));
    }
}
