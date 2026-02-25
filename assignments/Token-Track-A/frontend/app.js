/* global ethers */

const CONTRACT_ADDRESS = "0xE18caA76c4c3061c84E47379c1acB090686A54d3";
const SEPOLIA_CHAIN_ID = 11155111n;

const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const $ = (id) => document.getElementById(id);

let provider;
let signer;
let contract;
const ETHERSCAN_BASE = "https://sepolia.etherscan.io/token";

function setStatus(id, text) {
  $(id).textContent = text;
}

function setNetworkPill(ok, text) {
  const pill = $("networkPill");
  pill.textContent = text;
  pill.classList.toggle("ok", ok);
}

function resolveIpfs(uri) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }
  return uri;
}

async function ensureSepolia() {
  const net = await provider.getNetwork();
  if (net.chainId !== SEPOLIA_CHAIN_ID) {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0xaa36a7" }
    ]);
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("mintStatus", "No wallet detected. Install Rabby or MetaMask.");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  await ensureSepolia();

  signer = await provider.getSigner();
  const addr = await signer.getAddress();
  $("walletAddr").textContent = addr;

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const name = await contract.name();
  const symbol = await contract.symbol();
  $("tokenName").textContent = name;
  $("tokenSymbol").textContent = symbol;

  setNetworkPill(true, "Sepolia");
  setStatus("mintStatus", "Connected.");
}

async function mint() {
  try {
    if (!contract) {
      await connectWallet();
    }

    const to = $("toAddress").value.trim() || (await signer.getAddress());
    const tokenIdRaw = $("tokenId").value.trim();
    if (tokenIdRaw === "") {
      setStatus("mintStatus", "Token ID is required.");
      return;
    }
    const tokenId = BigInt(tokenIdRaw);

    setStatus("mintStatus", "Submitting transaction...");
    const tx = await contract.mint(to, tokenId);
    setStatus("mintStatus", `Tx sent: ${tx.hash}`);
    await tx.wait();
    setStatus("mintStatus", `Minted token ${tokenId} to ${to}.`);
  } catch (err) {
    setStatus("mintStatus", err?.shortMessage || err?.message || String(err));
  }
}

async function readToken() {
  try {
    if (!contract) {
      await connectWallet();
    }

    const tokenIdRaw = $("readTokenId").value.trim();
    if (tokenIdRaw === "") {
      setStatus("mintStatus", "Token ID is required to read.");
      return;
    }
    const tokenId = BigInt(tokenIdRaw);

    const owner = await contract.ownerOf(tokenId);
    const uri = await contract.tokenURI(tokenId);

    $("ownerOf").textContent = owner;
    $("tokenUri").textContent = uri;
    $("explorerLink").href = `${ETHERSCAN_BASE}/${CONTRACT_ADDRESS}?a=${tokenId}`;

    const metaUrl = resolveIpfs(uri);
    let imageUrl = "";
    if (metaUrl) {
      const res = await fetch(metaUrl);
      if (res.ok) {
        const meta = await res.json();
        imageUrl = resolveIpfs(meta.image || "");
      }
    }

    const img = $("tokenImage");
    if (imageUrl) {
      img.src = imageUrl;
      img.style.display = "block";
      $("imageCaption").textContent = imageUrl;
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
      $("imageCaption").textContent = "No image found in metadata.";
    }
  } catch (err) {
    $("ownerOf").textContent = "—";
    $("tokenUri").textContent = "—";
    $("tokenImage").removeAttribute("src");
    $("tokenImage").style.display = "none";
    $("imageCaption").textContent = "—";
    setStatus("mintStatus", err?.shortMessage || err?.message || String(err));
  }
}

$("connectBtn").addEventListener("click", connectWallet);
$("mintBtn").addEventListener("click", mint);
$("readBtn").addEventListener("click", readToken);

window.addEventListener("load", () => {
  $("contractAddr").textContent = CONTRACT_ADDRESS;
  $("explorerLink").href = `${ETHERSCAN_BASE}/${CONTRACT_ADDRESS}?a=1`;
  $("tokenImage").style.display = "none";
});
