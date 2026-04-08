import axios from "axios";

export const  getBlockByNumber= async(number: string, bol: boolean, id:number) => {
  try {
    const response = await axios.post('https://ethereum-rpc.publicnode.com', {
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [number, bol],
      id: id
    });
    console.log('Block Data for', number, ':', response);
    return response
  } catch (error) {
    console.error("Error fetching block by number:", error);
    throw error;
  }
}

export const getBlockNumber = async() => {
 const res = await axios.post('https://ethereum-rpc.publicnode.com', {
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
  return res
}