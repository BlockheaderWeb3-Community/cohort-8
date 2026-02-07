const crypto = require("crypto");
const fs = require("fs");
const { keccak256 } = require("js-sha3");

/* ============================================================
   STEP 0: Load BIP-39 wordlist (2048 words)
============================================================ */

const WORDLIST = fs.readFileSync("english.txt", "utf8").trim().split("\n");


/**
 * Convert a byte array into a binary string
 * Example:
 *   Buffer [255] -> "11111111"
 */
function bytesToBinary(bytes) {
    let binary = "";

    for (let i = 0; i < bytes.length; i++) {
        // Convert each byte to binary
        let byteInBinary = bytes[i].toString(2);

        // Make sure each byte is 8 bits long
        while (byteInBinary.length < 8) {
            byteInBinary = "0" + byteInBinary;
        }

        binary += byteInBinary;
    }

    return binary;
}

/**
 * Modulo function that always returns a positive value
 */
function mod(number, modulus) {
    let result = number % modulus;

    if (result < 0n) {
        result = result + modulus;
    }

    return result;
}


/**
 * Calculate modular inverse using
 * the Extended Euclidean Algorithm
 **/
function modInv(a, m) {
    let low = mod(a, m);
    let high = m;

    let lm = 1n;
    let hm = 0n;

    while (low > 1n) {
        // How many times does high fit into low
        let ratio = high / low;

        // Save previous values
        let newLm = hm - lm * ratio;
        let newLow = high - low * ratio;

        // Move values forward
        hm = lm;
        lm = newLm;

        high = low;
        low = newLow;
    }

    return mod(lm, m);
}
/* ============================================================
   STEP 1: Generate entropy
============================================================ */

function generateEntropy(bits = 128) {
    console.log("==== STEP 1: ENTROPY ====");
    const entropy = crypto.randomBytes(bits / 8);
    console.log(entropy.toString("hex"), "\n");
    return entropy;
}

/* ============================================================
   STEP 2: Entropy → Mnemonic (REAL BIP-39)
   ENT + checksum → 11-bit chunks → wordlist
============================================================ */

function entropyToMnemonic(entropy) {
    console.log("==== STEP 2: MNEMONIC PHRASE ====");

    const ENT = entropy.length * 8;
    const CS = ENT / 32;

    const hash = crypto.createHash("sha256").update(entropy).digest();

    const entropyBits = bytesToBinary(entropy);
    const checksumBits = bytesToBinary(hash).slice(0, CS);

    const bits = entropyBits + checksumBits;

    const chunks = bits.match(/.{1,11}/g);

    const mnemonic = chunks
        .map(bin => WORDLIST[parseInt(bin, 2)])
        .join(" ");

    console.log(mnemonic, "\n");
    return mnemonic;
}

/* ============================================================
   STEP 3: Mnemonic → Seed (PBKDF2-HMAC-SHA512)
============================================================ */

function mnemonicToSeed(mnemonic) {
    console.log("==== STEP 3: SEED (512-bit) ====");

    const seed = crypto.pbkdf2Sync(
        mnemonic,
        "mnemonic",
        2048,
        64,
        "sha512"
    );

    console.log(seed.toString("hex"), "\n");
    return seed;
}

/* ============================================================
   STEP 4: Seed → Private Key (256 bits)
============================================================ */

function seedToPrivateKey(seed) {
    console.log("==== STEP 4: PRIVATE KEY ====");

    const privateKey = seed.slice(0, 32);
    console.log(privateKey.toString("hex"), "\n");
    return privateKey;
}

/* ============================================================
   STEP 5: Private Key → Public Key (secp256k1)
   PublicKey = PrivateKey × G
============================================================ */

// secp256k1 constants
const CURVE_PRIME  = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
const G_X = BigInt("0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798");
const G_Y = BigInt("0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");

// Elliptic curve point addition
function isValidPoint(p) {
  return (
    p !== null &&
    Array.isArray(p) &&
    p.length === 2 &&
    typeof p[0] === "bigint" &&
    typeof p[1] === "bigint"
  );
}

function addPoints(pointA, pointB) {
  if (pointA === null) return pointB;
  if (pointB === null) return pointA;

  if (!isValidPoint(pointA) || !isValidPoint(pointB)) {
    console.error("Bad points:", pointA, pointB);
    return null;
  }

  const [x1, y1] = pointA;
  const [x2, y2] = pointB;

  if (x1 === x2 && y1 !== y2) {
    return null;
  }

  let slope;

  if (x1 === x2 && y1 === y2) {
    const top = 3n * x1 * x1;
    const bottom = modInv(2n * y1, CURVE_PRIME);
    slope = top * bottom;
  } else {
    const top = y2 - y1;
    const bottom = modInv(x2 - x1, CURVE_PRIME);
    slope = top * bottom;
  }

  slope = mod(slope, CURVE_PRIME);

  const x3 = mod(slope * slope - x1 - x2, CURVE_PRIME);
  const y3 = mod(slope * (x1 - x3) - y1, CURVE_PRIME);

  return [x3, y3];
}


// Scalar multiplication (double-and-add)
function scalarMultiply(k, point) {
  let result = null;
  let addend = point;

  while (k > 0n) {
    if (k & 1n) {
      result = addPoints(result, addend);
    }

    addend = addPoints(addend, addend);

    if (addend === null) {
      return result;
    }

    k >>= 1n;
  }

  return result;
}


function privateKeyToPublicKey(privateKey) {
  console.log("==== STEP 5: PUBLIC KEY ====");

  // Convert private key buffer into a number
  const privateNumber = BigInt("0x" + privateKey.toString("hex"));

  // Starting point on the curve
  const G_X = 1n;
  const G_Y = 3n;
  const generatorPoint = [G_X, G_Y];

  // Public key = private key × generator point
  const publicPoint = scalarMultiply(privateNumber, generatorPoint);

  const xHex = publicPoint[0].toString(16).padStart(64, "0");
  const yHex = publicPoint[1].toString(16).padStart(64, "0");

  const publicKey = xHex + yHex;

  console.log(publicKey, "\n");

  return Buffer.from(publicKey, "hex");
}

/* ============================================================
   STEP 6: Public Key → Keccak-256
============================================================ */

function publicKeyToHash(publicKey) {
    console.log("==== STEP 6: KECCAK-256 ====");

    const hash = keccak256(publicKey);
    console.log(hash, "\n");
    return hash;
}

/* ============================================================
   STEP 7: Hash → Ethereum Address
   Last 20 bytes (40 hex chars)
============================================================ */

function hashToAddress(hash) {
    console.log("==== STEP 7: ETHEREUM ADDRESS ====");

    const address = "0x" + hash.slice(-40);
    console.log(address, "\n");
    return address;
}

/* ============================================================
   GenerateEthereumWallet Fxn
============================================================ */

function generateEthereumWallet() {
    const entropy = generateEntropy();
    const mnemonic = entropyToMnemonic(entropy);
    const seed = mnemonicToSeed(mnemonic);
    const privateKey = seedToPrivateKey(seed);
    const publicKey = privateKeyToPublicKey(privateKey);
    const hash = publicKeyToHash(publicKey);
    const address = hashToAddress(hash);

    return {
        mnemonic,
        privateKey: privateKey.toString("hex"),
        publicKey: publicKey.toString("hex"),
        address
    };
}

/* ============================================================
   Test 
============================================================ */

const wallet = generateEthereumWallet();

console.log("==== WALLET OBJECT ====");
console.log(wallet);
