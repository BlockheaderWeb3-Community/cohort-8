import { ethers } from 'ethers';
const ETHEREUM_API_KEY = "6c54b451816345c7894af520f9f011a4"
const ETHEREUM_RPC_URL = `https://mainnet.infura.io/v3/${ETHEREUM_API_KEY}`

const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

export { provider };