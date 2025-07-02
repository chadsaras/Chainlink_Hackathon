// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISkinOwnership {
    struct SkinOwner {
        string username;
        uint256[] skinIds;
    }

    function getUser(
        string memory _userName
    ) external returns (SkinOwner memory);

    function deleteUser(string memory _username) external;

    function addSkinToUser(string memory _username, uint256 _skinId) external;

    function removeSkinFromUser(
        string memory _username,
        uint256 _skinId
    ) external;

    function getUserSkins(
        string memory _username
    ) external view returns (uint256[] memory);

    function createUser(
        string memory _userName
    ) external returns (SkinOwner memory);
}

contract SkinMarket {
    address payable public owner;
    address payable public game;
    ISkinOwnership public skinOwnership;

    struct SkinSeller {
        uint256 id;
        string userName;
        address payable walletAddress;
        uint256 price;
        address payable gameCompany;
    }

    mapping(uint256 => SkinSeller[]) public skinSellers;
    mapping(uint256 => uint256) private gameSkinPrices;
    uint256[] public allSkins;

    constructor(address _skinOwnershipAddress, address payable _game) {
        owner = payable(msg.sender);
        skinOwnership = ISkinOwnership(_skinOwnershipAddress);
        game = _game;

        // Initial data -all skins costs 1 eth in game
        uint256 initialPrice = 1 ether;
        for (uint256 i = 1; i <= 5; i++) {
            gameSkinPrices[i] = initialPrice;
            allSkins.push(i);
        }
    }

    function AddOrEditSkin(uint256 _skinId, uint256 price) external {
        require(msg.sender == owner, "Only owner can modify this");
        gameSkinPrices[_skinId] = price;

        bool skinExists = false;
        for (uint256 i = 0; i < allSkins.length; i++) {
            if (allSkins[i] == _skinId) {
                skinExists = true;
                break;
            }
        }
        if (!skinExists) {
            allSkins.push(_skinId);
        }
    }

    function getSkinPriceFromGame(
        uint256 _skinId
    ) external view returns (uint256) {
        return gameSkinPrices[_skinId];
    }

    function buyFromGame(
        uint256 _skinId,
        string memory _userName
    ) public payable {
        require(msg.value == gameSkinPrices[_skinId], "Incorrect price sent");
        game.transfer(msg.value);

        ISkinOwnership.SkinOwner memory user = skinOwnership.getUser(_userName);
        if (bytes(user.username).length == 0) {
            skinOwnership.createUser(_userName);
        }

        skinOwnership.addSkinToUser(_userName, _skinId);
    }

    function getSellers(
        uint256 skinId
    ) public view returns (SkinSeller[] memory) {
        return skinSellers[skinId];
    }

    function getSeller(
        uint256 skinId,
        uint256 id
    ) public view returns (SkinSeller memory) {
        require(skinSellers[skinId].length > 0, "No sellers for this skin ID");

        for (uint256 i = 0; i < skinSellers[skinId].length; i++) {
            if (skinSellers[skinId][i].id == id) {
                return skinSellers[skinId][i];
            }
        }
        revert("Seller not found");
    }

    function buySkin(
        string memory userName,
        uint256 skinId,
        uint256 sellerId
    ) public payable returns (bool) {
        require(skinSellers[skinId].length > 0, "No sellers for this skin ID");

        SkinSeller memory seller = getSeller(skinId, sellerId);
        require(msg.value == seller.price, "Incorrect price sent");

        uint256 totalAmount = msg.value;
        uint256 amountToSeller = (totalAmount * 90) / 100;
        uint256 amountToGameCompany = (totalAmount * 9) / 100;
        uint256 amountToOwner = (totalAmount * 1) / 100;

        seller.walletAddress.transfer(amountToSeller);
        owner.transfer(amountToOwner);
        seller.gameCompany.transfer(amountToGameCompany);

        for (uint256 i = 0; i < skinSellers[skinId].length; i++) {
            if (skinSellers[skinId][i].id == sellerId) {
                skinSellers[skinId][i] = skinSellers[skinId][
                    skinSellers[skinId].length - 1
                ];
                skinSellers[skinId].pop();
                break;
            }
        }

        ISkinOwnership.SkinOwner memory user = skinOwnership.getUser(userName);
        if (bytes(user.username).length == 0) {
            skinOwnership.createUser(userName);
        }

        skinOwnership.addSkinToUser(userName, skinId);

        return true;
    }

    function sellSkin(
        uint256 skinId,
        string memory _userName,
        address payable _walletAddress,
        uint256 _price
    ) public {
        uint256[] memory skins = skinOwnership.getUserSkins(_userName);
        bool haveSkin = false;

        for (uint256 i = 0; i < skins.length; i++) {
            if (skins[i] == skinId) {
                haveSkin = true;
                break;
            }
        }
        require(haveSkin, "You don't own this skin");

        SkinSeller memory newSeller = SkinSeller({
            id: skinSellers[skinId].length,
            userName: _userName,
            walletAddress: _walletAddress,
            price: _price,
            gameCompany: game
        });

        skinSellers[skinId].push(newSeller);
        skinOwnership.removeSkinFromUser(_userName, skinId);
    }

    function getAllSkins() external view returns (uint256[] memory) {
        return allSkins;
    }
}

// contract address: 0x0DedDe527e2B24a6c2B3bF5F3E7488517E37F3AD
