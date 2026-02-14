import { sha256, keccak256, randomBytes, toUtf8Bytes, concat } from 'ethers';

/**
 * Generates a list of random hashes using SHA-256 or Keccak-256
 * @param {number} count - Number of hashes to generate
 * @param {string} algorithm - Hash algorithm: 'sha256' or 'keccak256'
 * @returns {Object} Object containing hashes array and algorithm used
 */
function generateRandomHashes(count, algorithm = 'keccak256') {
  const hashes = [];

  for (let i = 0; i < count; i++) {
    const randomData = randomBytes(32);

    let hash;
    if (algorithm === 'sha256') {
      hash = sha256(randomData);
    } else if (algorithm === 'keccak256') {
      hash = keccak256(randomData);
    } else {
      throw new Error('Unsupported algorithm. Use "sha256" or "keccak256"');
    }

    hashes.push(hash);
  }

  return {
    hashes,
    algorithm,
  };
}

/**
 * Hash a string using the specified algorithm
 * @param {string} text - Text to hash
 * @param {string} algorithm - Hash algorithm: 'sha256' or 'keccak256'
 * @returns {Object} Object containing hash and algorithm used
 */
function hashString(text, algorithm = 'keccak256') {
  const bytes = toUtf8Bytes(text);

  let hash;
  if (algorithm === 'sha256') {
    hash = sha256(bytes);
  } else if (algorithm === 'keccak256') {
    hash = keccak256(bytes);
  } else {
    throw new Error('Unsupported algorithm. Use "sha256" or "keccak256"');
  }

  return {
    hash,
    algorithm,
  };
}

/**
 * Combines two hashes by sorting them and hashing the concatenation
 * @param {string} left - Left hash
 * @param {string} right - Right hash
 * @param {string} algorithm - Hash algorithm to use (internal)
 * @returns {string} Combined hash
 */
function combineHashes(left, right, algorithm) {
  // Sort hashes to ensure consistent ordering
  const [first, second] = left < right ? [left, right] : [right, left];

  console.log(
    `    Combining: ${first.slice(0, 10)}... + ${second.slice(0, 10)}...`
  );

  // Concatenate and hash
  const combined = concat([first, second]);
  const hash = algorithm === 'sha256' ? sha256(combined) : keccak256(combined);

  console.log(`    Result:    ${hash.slice(0, 10)}...`);

  return hash;
}

/**
 * Builds a Merkle root from the result of generateRandomHashes or an array with algorithm
 * @param {Object|string[]} leavesInput - Either result from generateRandomHashes or array of hashes
 * @param {string} [algorithmOverride] - Optional algorithm override (only if leavesInput is plain array)
 * @returns {string} Merkle root hash
 */
function buildMerkleRoot(leavesInput, algorithmOverride) {
  let leaves, algorithm;

  // Check if input is from generateRandomHashes (has algorithm property)
  if (
    leavesInput &&
    typeof leavesInput === 'object' &&
    leavesInput.hashes &&
    leavesInput.algorithm
  ) {
    leaves = leavesInput.hashes;
    algorithm = leavesInput.algorithm;
  } else if (Array.isArray(leavesInput)) {
    // Plain array provided
    leaves = leavesInput;
    algorithm = algorithmOverride || 'keccak256';
  } else {
    throw new Error(
      'Invalid input. Provide result from generateRandomHashes or array of hashes.'
    );
  }

  if (!leaves || leaves.length === 0) {
    throw new Error('Cannot build Merkle tree from empty array');
  }

  console.log('\n========================================');
  console.log('BUILDING MERKLE TREE');
  console.log('========================================');
  console.log(`Algorithm: ${algorithm.toUpperCase()}`);
  console.log(`Total leaves: ${leaves.length}`);
  console.log('========================================\n');

  // Log initial leaves
  console.log('LEVEL 0 (Leaves):');
  leaves.forEach((leaf, i) => {
    console.log(`  [${i}] ${leaf}`);
  });
  console.log('');

  let currentLevel = [...leaves];
  let levelNumber = 1;

  // Build tree level by level
  while (currentLevel.length > 1) {
    console.log(`LEVEL ${levelNumber}:`);
    console.log(
      `  Processing ${currentLevel.length} nodes -> ${Math.ceil(
        currentLevel.length / 2
      )} parent nodes`
    );
    console.log('');

    const nextLevel = [];

    // Process pairs
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // We have a pair
        console.log(`  Pair ${Math.floor(i / 2)}:`);
        console.log(`    Left:  ${currentLevel[i]}`);
        console.log(`    Right: ${currentLevel[i + 1]}`);

        const parentHash = combineHashes(
          currentLevel[i],
          currentLevel[i + 1],
          algorithm
        );
        nextLevel.push(parentHash);

        console.log('');
      } else {
        // Odd one out - promote to next level
        console.log(`  Single node (promoted):`);
        console.log(`    ${currentLevel[i]}`);
        nextLevel.push(currentLevel[i]);
        console.log('');
      }
    }

    // Log the resulting level
    console.log(`  Level ${levelNumber} Result:`);
    nextLevel.forEach((hash, i) => {
      console.log(`    [${i}] ${hash}`);
    });
    console.log('\n' + '----------------------------------------\n');

    currentLevel = nextLevel;
    levelNumber++;
  }

  const root = currentLevel[0];

  console.log('========================================');
  console.log('MERKLE ROOT (Final):');
  console.log(root);
  console.log('========================================\n');

  return root;
}

// Example usage - Algorithm specified ONLY at generation time
console.log('Generating 7 hashes for Merkle tree...\n');

// The ONLY place we specify the algorithm
const result = generateRandomHashes(75, 'sha256'); // Change to 'sha256' if needed

console.log(`Using ${result.algorithm.toUpperCase()} for entire process\n`);
console.log('Generated leaves:');
result.hashes.forEach((hash, i) => {
  console.log(`${i + 1}. ${hash}`);
});

// Algorithm is implicitly carried through - no need to specify again!
const merkleRoot = buildMerkleRoot(result);

console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================');
console.log(`Hash Algorithm: ${result.algorithm.toUpperCase()}`);
console.log(`Total leaves: ${result.hashes.length}`);
console.log(`Tree height: ${Math.ceil(Math.log2(result.hashes.length)) + 1}`);
console.log(`Merkle Root: ${merkleRoot}`);
console.log('========================================');

// Export functions
export { generateRandomHashes, hashString, buildMerkleRoot, combineHashes };
