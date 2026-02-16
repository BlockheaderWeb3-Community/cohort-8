use wallet_core::{
    generate_entropy,
    entropy_to_mnemonic,
    get_wordlist,
    mnemonic_to_seed,
    seed_to_master_key,
    derive_path,
    private_to_public_key,
    public_key_to_address,
    to_checksum_address,
    EthereumNetwork,
    get_balance,
    get_transaction_count,
    get_gas_price,
    send_raw_transaction,
    wei_to_eth,
    eth_to_wei,
    create_signed_transaction,
};
use std::io::{self, Write};

#[tokio::main]
async fn main() {
    println!("\n🔐 Ethereum HD Wallet - Sepolia Testnet\n");

    // Step 1: Generate or use existing mnemonic
    println!("Step 1: Wallet Setup");
    let (entropy_bytes, _) = generate_entropy(128).unwrap();
    let wordlist = get_wordlist();
    let mnemonic = entropy_to_mnemonic(&entropy_bytes, &wordlist).unwrap();

    println!("Your Mnemonic: {}", mnemonic);
    println!("⚠️  Save this mnemonic securely!\n");

    // Step 2: Generate wallet
    let passphrase = "";
    let seed = mnemonic_to_seed(&mnemonic, passphrase);
    let master = seed_to_master_key(&seed).unwrap();

    // Derive first account
    let path = "m/44'/60'/0'/0/0";
    let key = derive_path(&master, path).unwrap();
    let public_key = private_to_public_key(&key.private_key);
    let address = public_key_to_address(&public_key);
    let checksum_address = to_checksum_address(&address);

    println!("Your Ethereum Address: {}", checksum_address);
    println!("Private Key: 0x{}\n", hex::encode(key.private_key));

    // Connect to Sepolia
    let network = EthereumNetwork::sepolia();
    println!("Connected to: {} (Chain ID: {})", network.name, network.chain_id);
    println!("RPC: {}\n", network.rpc_url);

    // Main menu loop
    loop {
        println!("\n📋 Menu:");
        println!("1. Check Balance");
        println!("2. Send Transaction");
        println!("3. Get Account Info");
        println!("4. Exit");
        print!("\nSelect option: ");
        io::stdout().flush().unwrap();

        let mut choice = String::new();
        io::stdin().read_line(&mut choice).unwrap();

        match choice.trim() {
            "1" => check_balance(&network, &checksum_address).await,
            "2" => send_transaction(&network, &key.private_key, &checksum_address).await,
            "3" => get_account_info(&network, &checksum_address).await,
            "4" => {
                println!("\n👋 Goodbye!");
                break;
            }
            _ => println!("❌ Invalid option"),
        }
    }
}

async fn check_balance(network: &EthereumNetwork, address: &str) {
    println!("\n💰 Checking balance...");

    match get_balance(network, address).await {
        Ok(balance_hex) => {
            match wei_to_eth(&balance_hex) {
                Ok(eth_balance) => {
                    println!("Balance: {} ETH", eth_balance);
                    println!("Balance (wei): {}", balance_hex);
                }
                Err(e) => println!("❌ Error converting balance: {}", e),
            }
        }
        Err(e) => println!("❌ Error fetching balance: {}", e),
    }
}

async fn send_transaction(network: &EthereumNetwork, private_key: &[u8; 32], from_address: &str) {
    println!("\n📤 Send Transaction");

    // Get recipient address
    print!("Enter recipient address: ");
    io::stdout().flush().unwrap();
    let mut to_address = String::new();
    io::stdin().read_line(&mut to_address).unwrap();
    let to_address = to_address.trim();

    // Get amount
    print!("Enter amount in ETH: ");
    io::stdout().flush().unwrap();
    let mut amount_str = String::new();
    io::stdin().read_line(&mut amount_str).unwrap();
    let amount: f64 = match amount_str.trim().parse() {
        Ok(a) => a,
        Err(_) => {
            println!("❌ Invalid amount");
            return;
        }
    };

    let value_wei = eth_to_wei(amount);

    // Get nonce
    println!("\n⏳ Fetching transaction count...");
    let nonce = match get_transaction_count(network, from_address).await {
        Ok(n) => n,
        Err(e) => {
            println!("❌ Error getting nonce: {}", e);
            return;
        }
    };

    // Get gas price
    println!("⏳ Fetching gas price...");
    let gas_price_hex = match get_gas_price(network).await {
        Ok(gp) => gp,
        Err(e) => {
            println!("❌ Error getting gas price: {}", e);
            return;
        }
    };

    let gas_price = u128::from_str_radix(gas_price_hex.trim_start_matches("0x"), 16).unwrap();
    let gas_limit = 21000u64; // Standard ETH transfer

    println!("\n📝 Transaction Details:");
    println!("From:      {}", from_address);
    println!("To:        {}", to_address);
    println!("Amount:    {} ETH", amount);
    println!("Gas Limit: {}", gas_limit);
    println!("Gas Price: {} wei", gas_price);
    println!("Nonce:     {}", nonce);
    
    print!("\nConfirm transaction? (yes/no): ");
    io::stdout().flush().unwrap();
    let mut confirm = String::new();
    io::stdin().read_line(&mut confirm).unwrap();
    
    if confirm.trim().to_lowercase() != "yes" {
        println!("❌ Transaction cancelled");
        return;
    }
    
    // Create and sign transaction
    println!("\n⏳ Signing transaction...");
    let signed_tx = match create_signed_transaction(
        private_key,
        to_address,
        value_wei,
        nonce,
        gas_price,
        gas_limit,
        network.chain_id,
    ) {
        Ok(tx) => tx,
        Err(e) => {
            println!("❌ Error signing transaction: {}", e);
            return;
        }
    };
    
    // Send transaction
    println!("⏳ Broadcasting transaction...");
    match send_raw_transaction(network, &signed_tx).await {
        Ok(tx_hash) => {
            println!("✅ Transaction sent!");
            println!("Transaction Hash: {}", tx_hash);
            println!("View on Sepolia Etherscan: https://sepolia.etherscan.io/tx/{}", tx_hash);
        }
        Err(e) => println!("❌ Error sending transaction: {}", e),
    }
}

async fn get_account_info(network: &EthereumNetwork, address: &str) {
    println!("\n📊 Account Information");
    let separator = "=".repeat(70);
    println!("{}", separator);
    
    // Get balance
    print!("Balance: ");
    match get_balance(network, address).await {
        Ok(balance_hex) => {
            match wei_to_eth(&balance_hex) {
                Ok(eth_balance) => println!("{} ETH", eth_balance),
                Err(_) => println!("{} wei", balance_hex),
            }
        }
        Err(e) => println!("Error: {}", e),
    }
    
    // Get nonce
    print!("Transaction Count: ");
    match get_transaction_count(network, address).await {
        Ok(nonce) => println!("{}", nonce),
        Err(e) => println!("Error: {}", e),
    }
    
    println!("{}", separator);
    println!("View on Sepolia Etherscan: https://sepolia.etherscan.io/address/{}", address);
}
