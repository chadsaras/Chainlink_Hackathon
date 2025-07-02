// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherReceiver {
    address payable public owner;
    address payable public seller;
    address payable public gameCompany;

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    // Calculate amounts to be sent to each recipient

    function Buy(
        address payable _seller,
        address payable _GameCompany
    ) external payable {
        seller = _seller;
        gameCompany = _GameCompany;
        uint totalAmount = msg.value;
        uint amountToseller = (totalAmount * 90) / 100;
        uint amountTogameCompany = (totalAmount * 9) / 100;
        uint amountToOwner = (totalAmount * 1) / 100;
        // Transfer amounts to recipients
        seller.transfer(amountToseller);
        gameCompany.transfer(amountTogameCompany);
        owner.transfer(amountToOwner);
    }
}

// contract address on sepolia - 0xb346d01c452a91f19895F5f26Ef845C1DE87b398
//ganache - 0x5070ee85A360899882E907c213cb7147c14466D4
