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
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Land {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        bool sold;
        uint256 [] CenterCoords;
        uint256[] PolygonCoords;
    }

    mapping(uint256 => Land) private idToMarketItem;

    event LandCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        bool sold,
        uint256[] CoordCenter,
        uint256[] PolygonCoords
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(address nftContract, uint256 tokenId,uint256 [] memory CoordCenter,uint256 [] memory PolygonCoords)
        public
        payable
        nonReentrant
    {_itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    
    idToMarketItem[itemId] =  Land(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      false,
      CoordCenter,
      PolygonCoords
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
      emit LandCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      false,
      CoordCenter,
      PolygonCoords
    );
}
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint tokenId = idToMarketItem[itemId].tokenId;

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
    payable(owner).transfer;
  }
  
}
