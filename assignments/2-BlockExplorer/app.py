import os
import requests
from flask import Flask, render_template, request
from web3 import Web3
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Public Ethereum RPC (PublicNode)
RPC_URL = "https://ethereum-rpc.publicnode.com"
w3 = Web3(Web3.HTTPProvider(RPC_URL))

def get_eth_price():
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true"
        response = requests.get(url).json()
        return {
            "price": response['ethereum']['usd'],
            "market_cap": response['ethereum']['usd_market_cap'],
            "change_24h": response['ethereum']['usd_24h_change']
        }
    except Exception as e:
        print(f"Error fetching price: {e}")
        return {"price": 0, "market_cap": 0, "change_24h": 0}

@app.template_filter('format_address')
def format_address(address):
    if not address:
        return ""
    return f"{address[:10]}...{address[-8:]}"

@app.template_filter('time_ago')
def time_ago(timestamp):
    diff = datetime.now().timestamp() - timestamp
    if diff < 60:
        return f"{int(diff)} secs ago"
    elif diff < 3600:
        return f"{int(diff // 60)} mins ago"
    else:
        return f"{int(diff // 3600)} hours ago"

def make_serializable(data):
    if isinstance(data, (list, tuple)):
        return [make_serializable(i) for i in data]
    if isinstance(data, dict):
        return {k: make_serializable(v) for k, v in data.items()}
    if hasattr(data, 'hex'):
        return data.hex()
    if hasattr(data, '__dict__') or hasattr(data, 'items'):
        return {k: make_serializable(v) for k, v in dict(data).items()}
    return data

def fetch_dashboard_data():
    latest_block_number = w3.eth.block_number
    
    # Get latest 6 blocks
    blocks = []
    for i in range(6):
        block = w3.eth.get_block(latest_block_number - i)
        blocks.append(make_serializable(block))
        
    # Get latest 6 transactions (from the latest block)
    latest_block_data = blocks[0]
    transactions = []
    tx_list = latest_block_data.get('transactions', [])
    for tx_hash in tx_list[:6]:
        tx = w3.eth.get_transaction(tx_hash)
        transactions.append(make_serializable(tx))
        
    eth_stats = get_eth_price()
    return {
        "blocks": blocks,
        "transactions": transactions,
        "stats": eth_stats,
        "latest_block_num": latest_block_number
    }

@app.route("/")
def index():
    try:
        data = fetch_dashboard_data()
        return render_template("index.html", **data)
    except Exception as e:
        return f"An error occurred: {str(e)}"

@app.route("/api/data")
def api_data():
    try:
        data = fetch_dashboard_data()
        # Convert timestamp to human readable in data for simplicity in JS
        for block in data['blocks']:
            block['time_ago'] = time_ago(block['timestamp'])
            block['miner_fmt'] = format_address(block['miner'])
        for tx in data['transactions']:
            tx['hash_fmt'] = format_address(tx['hash'])
            tx['from_fmt'] = format_address(tx['from'])
            tx['to_fmt'] = format_address(tx['to']) if tx['to'] else 'Contract Creation'
            tx['value_eth'] = round(tx['value'] / 10**18, 4)
            
        return data
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/block/<int:block_num>")
def block_detail(block_num):
    try:
        block = w3.eth.get_block(block_num)
        serializable_block = make_serializable(block)
        eth_stats = get_eth_price()
        return render_template("block.html", block=serializable_block, stats=eth_stats)
    except Exception as e:
        return f"Block not found: {str(e)}", 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
