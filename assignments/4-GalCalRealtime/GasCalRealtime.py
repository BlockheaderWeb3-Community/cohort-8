from web3 import Web3

def get_real_time_gas_estimate(rpc_url, tx_params):
    # Connect to the node
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        return "Error: Could not connect to the Ethereum node."

    # Estimate Gas Limit (Units) 
    raw_gas_limit = w3.eth.estimate_gas(tx_params)
    gas_limit = int(raw_gas_limit) 
    
    # Get current Base Fee (EIP-1559)
    latest_block = w3.eth.get_block('latest')
    base_fee = latest_block['baseFeePerGas']

    # Get Suggested Priority Fee (Tip)
    priority_fee = w3.eth.max_priority_fee

    # Total calculation in Wei
    total_cost_wei = gas_limit * (base_fee + priority_fee)
    
    return {
        "gas_limit": gas_limit,
        "base_fee_gwei": w3.from_wei(base_fee, 'gwei'),
        "priority_fee_gwei": w3.from_wei(priority_fee, 'gwei'),
        "estimated_cost_eth": w3.from_wei(total_cost_wei, 'ether')
    }

# --- MAIN EXECUTION BLOCK ---
if __name__ == "__main__":
    # Using a public provider like LlamaRPC because there is no signup required.
    YOUR_RPC_URL = "https://eth.llamarpc.com" 
    
    # Example transaction parameters
    sample_tx = {
        'to': '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', # Reciever
        'value': Web3.to_wei(0.01, 'ether'),
        'from': '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', # Sender

    }

    try:
        results = get_real_time_gas_estimate(YOUR_RPC_URL, sample_tx)
        print("-" * 30)
        print("ETHEREUM GAS ESTIMATOR (REAL-TIME)")
        print("-" * 30)
        for key, value in results.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        print("-" * 30)
    except Exception as e:
        print(f"An error occurred: {e}")