# Simple Gas Fee Calculation in Rust

This project demonstrates a **basic gas fee calculation model** using Rust.  
It is intended to explain the **core idea behind gas fees** in blockchains like Ethereum — paying for computational work.

This is a **conceptual example**, not an exact implementation of Ethereum’s gas system.

---

## What This Program Does

The program:
- Defines a unit of computational work
- Defines a price per unit of work
- Multiplies the two values to compute a gas fee

---

## Conceptual Model

```text
Gas Fee = Computational Work × Price Per Unit




### Gas 
Gas is a unit of measurement. It measures how much computation a transaction uses

### Gas Limit 
Gas limit is the maximum amount of gas you are willing to use for a transaction.

### Gas price
Gas price is how much ETH you pay per unit of gas. It's measured in gwei

### Burnt/Base Fee
Since EIP-1559, Ethereum splits the transaction fee into parts.
The Base Fee (Burnt Fee)
A base fee is calculated automatically by the network
It changes depending on network congestion
This base fee is burned (destroyed forever)
**Burned ETH is removed from circulation → makes ETH deflationary**
