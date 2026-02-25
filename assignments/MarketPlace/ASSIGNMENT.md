## TRACK B: NFT Marketplace

### Scenario

You are building a minimal NFT marketplace contract that:

- Allows listing ERC-721 tokens
- Allows buying listed NFTs
- Handles marketplace fees

---

### Functional Requirements

### 1. Listing NFTs

Requirements:

- Only owner can list
- Marketplace must be approved
- NFT must be transferred or escrowed

---

### 2. Cancel Listing

```
cancelListing(...)
```

Must:

- Only allow seller
- Return NFT

---

### 3. Buy NFT

```
buy(...)
```

Must:

- Transfer ETH to seller
- Deduct marketplace fee
- Transfer NFT to buyer
- Be safe against reentrancy

### 4. Marketplace Fee

- Owner sets fee (2.5%)
- Fee sent to treasury
