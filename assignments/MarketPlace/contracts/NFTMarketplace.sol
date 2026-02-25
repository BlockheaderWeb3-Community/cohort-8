// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract NFTMarketplace {
    address public owner;
    uint256 private locked;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    uint256 public feePercent = 250;
    address public treasury;

    event Listed(address indexed nft, uint256 indexed tokenId, address seller, uint256 price);
    event Canceled(address indexed nft, uint256 indexed tokenId);
    event Sold(address indexed nft, uint256 indexed tokenId, address buyer, uint256 price);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier nonReentrant() {
        require(locked == 0, "Reentrant");
        locked = 1;
        _;
        locked = 0;
    }

    constructor(address _treasury) {
        owner = msg.sender;
        treasury = _treasury;
    }

    function list(address nft, uint256 tokenId, uint256 price) external {
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "Not owner");
        require(IERC721(nft).getApproved(tokenId) == address(this) || 
                IERC721(nft).isApprovedForAll(msg.sender, address(this)), "Not approved");
        
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);
        
        listings[nft][tokenId] = Listing(msg.sender, price);
        emit Listed(nft, tokenId, msg.sender, price);
    }

    function cancelListing(address nft, uint256 tokenId) external {
        Listing memory listing = listings[nft][tokenId];
        require(listing.seller == msg.sender, "Not seller");
        
        delete listings[nft][tokenId];
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        
        emit Canceled(nft, tokenId);
    }

    function buy(address nft, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nft][tokenId];
        require(listing.price > 0, "Not listed");
        require(msg.value == listing.price, "Wrong price");
        
        delete listings[nft][tokenId];
        
        uint256 fee = (listing.price * feePercent) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        payable(treasury).call{value:fee}("");
        payable(listing.seller).call{value: sellerAmount}("");
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        
        emit Sold(nft, tokenId, msg.sender, listing.price);
    }

    function setFee(uint256 _feePercent) external onlyOwner {
        feePercent = _feePercent;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
}
