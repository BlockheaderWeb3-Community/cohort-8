import streamlit as st
import os
from bip_utils import (
    Bip39MnemonicGenerator, Bip39SeedGenerator, 
    Bip44, Bip44Coins, Bip44Changes
)
from eth_utils import keccak, to_checksum_address
from eth_keys import keys

# --- Logic Functions ---
def generate_wallet():
    # 1. Entropy
    entropy_bytes = os.urandom(16)
    
    # 2. Mnemonic
    mnemonic = Bip39MnemonicGenerator().FromEntropy(entropy_bytes)
    
    # 3. Seed
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
    
    # 4. Derivation (BIP-44)
    bip44_mst_ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)
    bip44_addr_ctx = (
        bip44_mst_ctx.Purpose()
        .Coin()
        .Account(0)
        .Change(Bip44Changes.CHAIN_EXT)
        .AddressIndex(0)
    )
    
    priv_key_hex = bip44_addr_ctx.PrivateKey().Raw().ToHex()
    
    # 5. Address Derivation
    priv_bytes = bytes.fromhex(priv_key_hex)
    priv_key_obj = keys.PrivateKey(priv_bytes)
    pub_key_bytes = priv_key_obj.public_key.to_bytes()
    public_key_hash = keccak(pub_key_bytes)
    address = to_checksum_address(public_key_hash[-20:])
    
    return {
        "entropy": entropy_bytes.hex(),
        "mnemonic": mnemonic,
        "priv_key": f"0x{priv_key_hex}",
        "address": address
    }

# --- UI Layout ---
def render_ui():
    st.set_page_config(page_title="Eth Wallet Generator", page_icon="🔐")

    st.title("🔐 Ethereum HD Wallet Generator")
    st.markdown("This tool uses **BIP-39** and **BIP-44** standards to derive Ethereum addresses from random entropy.")

    if st.button("Generate New Wallet", type="primary"):
        wallet = generate_wallet()

        st.success("Wallet Generated Successfully!")

        # Display results in structured containers
        with st.expander("1. Raw Entropy (128-bit)", expanded=True):
            st.code(wallet['entropy'])

        with st.container():
            st.subheader("2. Recovery Phrase (Mnemonic)")
            st.info(f"**{wallet['mnemonic']}**")
            st.caption("Write this down! It is the master key to your funds.")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Private Key")
            st.code(wallet['priv_key'])

        with col2:
            st.subheader("Public Address")
            st.code(wallet['address'])

        st.warning("⚠️ **Security Warning:** Never share your Private Key or Mnemonic with anyone. This UI is for educational purposes.")

    else:
        st.info("Click the button above to generate a unique Ethereum wallet.")


# When executed directly (python app.py) provide a simple CLI fallback so the
# file can be run without Streamlit. When imported by Streamlit (via
# `streamlit run app.py`) `__name__` will not be "__main__" and `render_ui()`
# will run to show the web UI.
# Always render the UI at import time so `streamlit run` shows the app.
render_ui()

if __name__ == "__main__":
    # If executed directly via plain Python (not `streamlit run`), provide a
    # simple CLI fallback. Detect whether we're running inside Streamlit by
    # checking ScriptRunContext; if present, do not run CLI logic.
    try:
        from streamlit.runtime.scriptrunner import get_script_run_ctx
        _ctx = get_script_run_ctx()
    except Exception:
        _ctx = None

    if _ctx is None:
        import argparse

        parser = argparse.ArgumentParser(description="Ethereum HD Wallet Generator (CLI fallback)")
        parser.add_argument("--generate", "-g", action="store_true", help="Generate a wallet and print details to stdout")
        args = parser.parse_args()

        if args.generate:
            wallet = generate_wallet()
            print("Wallet generated (CLI mode):")
            print(f"Entropy: {wallet['entropy']}")
            print(f"Mnemonic: {wallet['mnemonic']}")
            print(f"Private Key: {wallet['priv_key']}")
            print(f"Address: {wallet['address']}")
        else:
            print("This script is intended to be run with Streamlit for the UI.")
            print("To open the web UI, run:\n\n  streamlit run /home/celestine/Documents/Cohot-8/assignments/WalletGen/app.py\n")