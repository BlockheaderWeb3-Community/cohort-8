function convertGweiToEth(unitInGwei) {
  // 1 Gwei = 10-9 ETH
  return unitInGwei / 1000000;
}

function getGasPrice(baseFee, priorityFee) {
  return baseFee + priorityFee;
}

function estimateGas(gasUsed, gasPrice) {
  const gasFeesInGwei = gasUsed * gasPrice;
  const gasFeesInEth = convertGweiToEth(gasFeesInGwei);
  return gasFeesInEth;
}

function calculateTotalGasFees(gasUsed, baseFee, priorityFee) {
  const gasPrice = getGasPrice(baseFee, priorityFee);
  return estimateGas(gasUsed, gasPrice);
}

// Example usage:
const gasUsed = 21000;
const baseFee = 50;
const priorityFee = 2;

const totalGasFees = calculateTotalGasFees(gasUsed, baseFee, priorityFee);
console.log(`Total Gas Fees in ETH: ${totalGasFees}`);
