// contracts/NFTMarket.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract NFTMarket is ReentrancyGuard, ChainlinkClient {
    using Counters for Counters.Counter;
    using Chainlink for Chainlink.Request;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    bytes32 public apiName;
    string public CoordCenterLat;
    string public CoordCenterLng;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    address payable owner;
    uint256 listingPrice = 1;

    constructor() {
        setPublicChainlinkToken();
        oracle = 0x92b39b120471cf7D18814b543F0A6f4DA802d4BB;
        jobId = "90b3e2abdde74c98bc2223b82d909c03";
        fee = 1 * 10**18; // (Varies by network and job)
        owner = payable(msg.sender);
    }

    struct Land {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        bool sold;
        uint256 price;
        bytes32 apiName;
        string CoordCenterLat;
        string CoordCenterLng;
    }

    mapping(uint256 => Land) private idToMarketItem;

    event LandCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        bool sold,
        uint256 price,
        bytes32 apiName,
        string CoordCenterLat,
        string CoordCenterLng
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string memory CoordCenterLat,
        string memory CoordCenterLng
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = Land(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            false,
            price,
            apiName,
            CoordCenterLat,
            CoordCenterLng
        );

        //IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit LandCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            false,
            price,
            apiName,
            CoordCenterLat,
            CoordCenterLng
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
        idToMarketItem[itemId].sold = true;
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

    function requestName() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        request.add(
            "get",
            "http://api.positionstack.com/v1/reverse?access_key=0ec8faafff8a3cf2ec1602b1bb173fd4&query=44.4125,4.52146"
        );

        request.add("path", "data.0.name");

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, bytes32 _apiName)
        public
        recordChainlinkFulfillment(_requestId)
        returns (bytes32)
    {
        apiName = _apiName;
        return apiName;
    }

    function bytes32ToString() public view returns (string memory) {
        uint8 i = 0;
        while (i < 32 && apiName[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && apiName[i] != 0; i++) {
            bytesArray[i] = apiName[i];
        }
        return string(bytesArray);
    }
}
