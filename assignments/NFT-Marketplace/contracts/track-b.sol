// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MinimalMarketplace is ReentrancyGuard, Ownable {
    
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    uint256 public feeBps = 250; // 2.5%
    address public treasury;

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    event Listed(address indexed seller, address indexed nft, uint256 indexed tokenId, uint256 price);
    event Sale(address indexed buyer, address indexed nft, uint256 indexed tokenId, uint256 price);
    event Canceled(address indexed seller, address indexed nft, uint256 indexed tokenId);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function listNft(address _nftContract, uint256 _tokenId, uint256 _price) external nonReentrant {
        require(_price > 0, "Price must be > 0");
        IERC721 nft = IERC721(_nftContract);
        
        require(nft.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");

        // Escrow the NFT
        nft.transferFrom(msg.sender, address(this), _tokenId);

        listings[_nftContract][_tokenId] = Listing({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        emit Listed(msg.sender, _nftContract, _tokenId, _price);
    }

    function cancelListing(address _nftContract, uint256 _tokenId) external nonReentrant {
        Listing storage listing = listings[_nftContract][_tokenId];
        require(listing.active, "Not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;
        IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);

        emit Canceled(msg.sender, _nftContract, _tokenId);
    }

    function buyNft(address _nftContract, uint256 _tokenId) external payable nonReentrant {
        Listing storage listing = listings[_nftContract][_tokenId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient ETH");

        listing.active = false; // Prevent reentrancy/double buy

        uint256 fee = (listing.price * feeBps) / 10000;
        uint256 sellerProceeds = listing.price - fee;

        // 1. Pay Treasury
        (bool feeSuccess, ) = payable(treasury).call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        // 2. Pay Seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller transfer failed");

        // 3. Transfer NFT to Buyer
        IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);

        // 4. Refund overpayment if any
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit Sale(msg.sender, _nftContract, _tokenId, listing.price);
    }

    function updateFee(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 1000, "Fee too high"); // Cap at 10%
        feeBps = _newFeeBps;
    }
}