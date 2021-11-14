// contracts/NFTMarket.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 1;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Land {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }
    mapping(uint256 => Land) private idToMarketItem;
    struct Coordinates {
        int256 CoordCenterLat;
        int256 CoordCenterLng;
        int256 CoordLat1;
        int256 CoordLat2;
        int256 CoordLat3;
        int256 CoordLat4;
        int256 CoordLng1;
        int256 CoordLng2;
        int256 CoordLng3;
        int256 CoordLng4;
    }
    mapping(uint256 => Coordinates) private idToCoordinates;

    event LandCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );
    event CoordinatesCreated(
        int256 CoordCenterLat,
        int256 CoordCenterLng,
        int256 CoordLat1,
        int256 CoordLat2,
        int256 CoordLat3,
        int256 CoordLat4,
        int256 CoordLng1,
        int256 CoordLng2,
        int256 CoordLng3,
        int256 CoordLng4
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        int256 CoordCenterLat,
        int256 CoordCenterLng,
        int256 CoordLat1,
        int256 CoordLat2,
        int256 CoordLat3,
        int256 CoordLat4,
        int256 CoordLng1,
        int256 CoordLng2,
        int256 CoordLng3,
        int256 CoordLng4,
        uint256 price
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = Land(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price
        );
        idToCoordinates[itemId] = Coordinates(
            CoordCenterLat,
            CoordCenterLng,
            CoordLat1,
            CoordLat2,
            CoordLat3,
            CoordLat4,
            CoordLng1,
            CoordLng2,
            CoordLng3,
            CoordLng4
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit LandCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price
        );
        emit CoordinatesCreated(
            CoordCenterLat,
            CoordCenterLng,
            CoordLat1,
            CoordLat2,
            CoordLat3,
            CoordLat4,
            CoordLng1,
            CoordLng2,
            CoordLng3,
            CoordLng4
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);

        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (Land[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        Land[] memory items = new Land[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                Land storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items of a user  */
    function fetchMyNFTs() public view returns (Land[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        Land[] memory items = new Land[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                Land storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only maps a user has created */
    function fetchItemsCreated() public view returns (Land[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        Land[] memory items = new Land[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                Land storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}

  


