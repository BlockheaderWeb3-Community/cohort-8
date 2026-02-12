from web3 import Web3
import rlp
from eth_utils import keccak, to_bytes

# My Infura Project ID.
infura_url = 'https://mainnet.infura.io/v3/69941d70a71a4329b18c84a16afe0c9c'

# We are connecting to Ethereum network using the Web3 tool.
w3 = Web3(Web3.HTTPProvider(infura_url))

# We are using this block number to derive the hash.
block_number = 19200000  

# Gettingthe block data from the network.
block = w3.eth.get_block(block_number)

# This function calculates the block hash from the block's details.
def compute_block_hash(block):
    # We creating a list of the block's "header".
    header = [
        to_bytes(block['parentHash']),      
        to_bytes(block['sha3Uncles']),     
        to_bytes(hexstr=block['miner']),    
        to_bytes(block['stateRoot']),       
        to_bytes(block['transactionsRoot']),
        to_bytes(block['receiptsRoot']),    
        to_bytes(block['logsBloom']),       
        block['difficulty'],                
        block['number'],
        block['gasLimit'],                    
        block['gasUsed'],                 
        block['timestamp'],                 
        to_bytes(block['extraData']),      
        to_bytes(block['mixHash']),         
        to_bytes(block['nonce'])            
    ]
    
    # Adding newer fields based on Ethereum updates 
    if 'baseFeePerGas' in block:
        header.append(block['baseFeePerGas'])  # Base fee for transactions 
    if 'withdrawalsRoot' in block:
        header.append(to_bytes(block['withdrawalsRoot']))  # Root for withdrawals 
    if 'blobGasUsed' in block:
        header.append(block['blobGasUsed'])    # Gas used for blobs 
        header.append(block['excessBlobGas'])  # Extra blob gas 
    if 'parentBeaconBlockRoot' in block:
        header.append(to_bytes(block['parentBeaconBlockRoot']))  # Link to beacon chain 
    
    # Encode the list using RLP (a special packing method Ethereum uses).
    encoded_header = rlp.encode(header)

    # Hashing it with Keccak-256.
    block_hash = keccak(encoded_header)
    
    # Convert to a readable Hex() format (starts with '0x').
    return '0x' + block_hash.hex()

# Compute the hash using our function.
computed_hash = compute_block_hash(block)

# Getting the official hash from the network for comparison.
# official_hash = "0x" + block['hash'].hex()

# Print the results to check if they match (they should!).git 
print("Computed Block Hash:", computed_hash)
# print("Official Block Hash:", official_hash)
# if computed_hash == official_hash:
#     print("Success! They match.") 
# else:
#     print("Something went wrong—check the code or network.")