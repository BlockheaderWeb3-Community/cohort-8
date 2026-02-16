use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Clone)]
pub struct EthereumNetwork {
    pub rpc_url: String,
    pub chain_id: u64,
    pub name: String,
}

impl EthereumNetwork {
    /// Sepolia testnet with primary RPC
    pub fn sepolia() -> Self {
        Self {
            rpc_url: "https://ethereum-sepolia-rpc.publicnode.com".to_string(),
            chain_id: 11155111,
            name: "Sepolia".to_string(),
        }
    }
    
    /// Get list of Sepolia RPC endpoints to try
    pub fn sepolia_rpcs() -> Vec<String> {
        vec![
            "https://ethereum-sepolia-rpc.publicnode.com".to_string(),
            "https://rpc.sepolia.org".to_string(),
            "https://sepolia.gateway.tenderly.co".to_string(),
            "https://ethereum-sepolia.blockpi.network/v1/rpc/public".to_string(),
        ]
    }
    
    /// Sepolia with custom API key
    pub fn sepolia_with_key(api_key: &str) -> Self {
        Self {
            rpc_url: format!("https://eth-sepolia.g.alchemy.com/v2/{}", api_key),
            chain_id: 11155111,
            name: "Sepolia".to_string(),
        }
    }
    
    /// Ethereum mainnet
    pub fn mainnet() -> Self {
        Self {
            rpc_url: "https://eth.llamarpc.com".to_string(),
            chain_id: 1,
            name: "Mainnet".to_string(),
        }
    }
    
    /// Custom RPC
    pub fn custom(rpc_url: String, chain_id: u64, name: String) -> Self {
        Self {
            rpc_url,
            chain_id,
            name,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct JsonRpcRequest {
    jsonrpc: String,
    method: String,
    params: serde_json::Value,
    id: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct JsonRpcResponse {
    jsonrpc: String,
    id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    result: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<JsonRpcError>,
}

#[derive(Debug, Serialize, Deserialize)]
struct JsonRpcError {
    code: i64,
    message: String,
}

/// Make RPC call with fallback support
async fn make_rpc_call(
    rpc_urls: &[String],
    method: &str,
    params: serde_json::Value,
) -> Result<serde_json::Value, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("Failed to build client: {}", e))?;
    
    let mut last_error = String::new();
    
    for (i, rpc_url) in rpc_urls.iter().enumerate() {
        let request = JsonRpcRequest {
            jsonrpc: "2.0".to_string(),
            method: method.to_string(),
            params: params.clone(),
            id: 1,
        };
        
        match client
            .post(rpc_url)
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await
        {
            Ok(response) => {
                let status = response.status();
                
                if status.as_u16() == 429 {
                    last_error = format!("RPC {} rate limited", i + 1);
                    continue;
                }
                
                match response.text().await {
                    Ok(body_text) => {
                        if !status.is_success() {
                            last_error = format!("HTTP error {}: {}", status, body_text);
                            continue;
                        }
                        
                        match serde_json::from_str::<JsonRpcResponse>(&body_text) {
                            Ok(rpc_response) => {
                                if let Some(error) = rpc_response.error {
                                    last_error = format!("RPC error: {}", error.message);
                                    continue;
                                }
                                
                                if let Some(result) = rpc_response.result {
                                    return Ok(result);
                                }
                                
                                last_error = "No result in response".to_string();
                            }
                            Err(e) => {
                                last_error = format!("Failed to parse JSON: {}", e);
                                continue;
                            }
                        }
                    }
                    Err(e) => {
                        last_error = format!("Failed to read response: {}", e);
                        continue;
                    }
                }
            }
            Err(e) => {
                last_error = format!("Request to RPC {} failed: {}", i + 1, e);
                continue;
            }
        }
    }
    
    Err(format!("All RPCs failed. Last error: {}", last_error))
}

/// Get balance of an Ethereum address
pub async fn get_balance(network: &EthereumNetwork, address: &str) -> Result<String, String> {
    let rpcs = if network.chain_id == 11155111 {
        EthereumNetwork::sepolia_rpcs()
    } else {
        vec![network.rpc_url.clone()]
    };
    
    let result = make_rpc_call(&rpcs, "eth_getBalance", json!([address, "latest"])).await?;
    
    result
        .as_str()
        .map(String::from)
        .ok_or_else(|| "Invalid balance format".to_string())
}

/// Get transaction count (nonce) for an address
pub async fn get_transaction_count(network: &EthereumNetwork, address: &str) -> Result<u64, String> {
    let rpcs = if network.chain_id == 11155111 {
        EthereumNetwork::sepolia_rpcs()
    } else {
        vec![network.rpc_url.clone()]
    };
    
    let result = make_rpc_call(&rpcs, "eth_getTransactionCount", json!([address, "latest"])).await?;
    
    let nonce_hex = result
        .as_str()
        .ok_or("Invalid nonce format")?;
    
    u64::from_str_radix(nonce_hex.trim_start_matches("0x"), 16)
        .map_err(|e| format!("Failed to parse nonce: {}", e))
}

/// Get current gas price
pub async fn get_gas_price(network: &EthereumNetwork) -> Result<String, String> {
    let rpcs = if network.chain_id == 11155111 {
        EthereumNetwork::sepolia_rpcs()
    } else {
        vec![network.rpc_url.clone()]
    };
    
    let result = make_rpc_call(&rpcs, "eth_gasPrice", json!([])).await?;
    
    result
        .as_str()
        .map(String::from)
        .ok_or_else(|| "Invalid gas price format".to_string())
}

/// Send raw transaction
pub async fn send_raw_transaction(network: &EthereumNetwork, signed_tx: &str) -> Result<String, String> {
    let rpcs = if network.chain_id == 11155111 {
        EthereumNetwork::sepolia_rpcs()
    } else {
        vec![network.rpc_url.clone()]
    };
    
    let result = make_rpc_call(&rpcs, "eth_sendRawTransaction", json!([signed_tx])).await?;
    
    result
        .as_str()
        .map(String::from)
        .ok_or_else(|| "Invalid transaction hash format".to_string())
}

/// Convert hex balance to ETH (with decimals)
pub fn wei_to_eth(wei_hex: &str) -> Result<String, String> {
    let wei_hex = wei_hex.trim_start_matches("0x");
    
    if wei_hex.is_empty() || wei_hex == "0" {
        return Ok("0.0".to_string());
    }
    
    let wei = u128::from_str_radix(wei_hex, 16)
        .map_err(|e| format!("Failed to parse wei: {}", e))?;
    
    let eth = wei as f64 / 1_000_000_000_000_000_000.0;
    
    Ok(format!("{:.18}", eth).trim_end_matches('0').trim_end_matches('.').to_string())
}

/// Convert ETH to wei
pub fn eth_to_wei(eth: f64) -> u128 {
    (eth * 1_000_000_000_000_000_000.0) as u128
}
