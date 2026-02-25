// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ERC721 Interface
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract NFTmarketplace {
    // Reentrancy guard
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    //  Marketplace state & setting
    address public owner;
    address payable public treasury;
    uint256 public feePercentage; // e.g., 25 for 2.5%

    struct Listing {
        address seller;
        uint256 price;
    }

    //  Maps
    mapping(address => mapping(uint256 => Listing)) public listings; // NFT contract => tokenId => Listing

    event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ListingCancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);
    event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

    constructor(address payable _treasury) {
        owner = msg.sender;
        treasury = _treasury;
        feePercentage = 25;
        _status = _NOT_ENTERED;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Marketplace fee
    function setFeePercentage(uint256 _newFee) external onlyOwner {
        feePercentage = _newFee;
    }

    // Listing NFTs
    function listNFT(address nftAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");

        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");

        require(
            nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address (this)),
            "Marketplace not approved"
        );

        // Escrow the NFT
        nft.transferFrom(msg.sender, address(this), tokenId);

        // Save the listing
        listings[nftAddress][tokenId] = Listing(msg.sender, price);

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

        // Cancel Listing
    function cancelListing(address nftAddress, uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];

        require(listing.price > 0, "Not Listed");
        require(listing.seller == msg.sender, "Not the selleer");

        // Remove Listing
        delete listings[nftAddress][tokenId];

        // Return NFT back to Seller
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        emit ListingCancelled(msg.sender, nftAddress, tokenId);
    }

    // Buy NFT
    function buyNFT(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];

        require(listing.price > 0, "Not Listed");
        require(msg.value >= listing.price, "Insufficient payment");

        // Calculate fee and seller cut 
        uint256 fee = (msg.value * feePercentage) / 1000;
        uint256 sellerProceeds = msg.value - fee;

        // Remove listing to prevent reentrancy
        delete listings[nftAddress][tokenId];

        // Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);

        //  Transfer funds to treasury
        (bool feeSuccess, ) = treasury.call{value: fee}("");
        require(feeSuccess, "Treasury transfer failed");

        // Transfer remaining funds to seller
        (bool sellerSuccesss, ) = payable(listing.seller).call{value: sellerProceeds}("");
        require(sellerSuccesss, "Seller transfer failed");

        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }
}